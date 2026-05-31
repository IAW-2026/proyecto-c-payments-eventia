import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { crearPreferenciaPago } from "@/lib/payments/mercadopago";
import { validarApiKey } from "@/lib/auth/apiKey";
import { obtenerRolUsuario, obtenerUsuarioClerk } from "@/lib/auth/clerk";
import { calcularComisionVenta } from "@/lib/payments/comisiones";

type NuevaTransaccionRequest = {
  idPedido: number;
  idEvento: number;
  monto: number;
  idComprador: string;
};

type VendedorResponse = {
  idVendedor: string;
};

const MAX_INT_POSTGRES = 2_147_483_647;

function obtenerMensajeError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  if (error && typeof error === "object") {
    return JSON.stringify(error);
  }

  return "Error desconocido";
}

function esNuevaTransaccionValida(
  body: unknown,
): body is NuevaTransaccionRequest {
  if (!body || typeof body !== "object") return false;

  const datos = body as Partial<NuevaTransaccionRequest>;

  return (
    typeof datos.idPedido === "number" &&
    Number.isInteger(datos.idPedido) &&
    datos.idPedido > 0 &&
    datos.idPedido <= MAX_INT_POSTGRES &&
    typeof datos.idEvento === "number" &&
    Number.isInteger(datos.idEvento) &&
    typeof datos.monto === "number" &&
    datos.monto > 0 &&
    typeof datos.idComprador === "string" &&
    datos.idComprador.trim().length > 0
  );
}

async function obtenerIdVendedor(idEvento: number, origen: string) {
  const sellerApiUrl = process.env.SELLER_API_URL ?? `${origen}/api`;
  const sellerApiKey = process.env.SELLER_API_KEY;

  if (!sellerApiKey) {
    throw new Error("SELLER_API_KEY no esta definida");
  }

  const response = await fetch(
    `${sellerApiUrl}/seller/eventos/vendedor/${idEvento}`,
    {
      method: "GET",
      headers: {
        "x-api-key": sellerApiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Seller respondio con estado ${response.status}`);
  }

  const data = (await response.json()) as Partial<VendedorResponse>;

  if (typeof data.idVendedor !== "string" || data.idVendedor.trim().length === 0) {
    throw new Error("Seller no devolvio un idVendedor valido");
  }

  return data.idVendedor;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!esNuevaTransaccionValida(body)) {
      return NextResponse.json(
        { error: "Datos de transaccion invalidos" },
        { status: 400 },
      );
    }

    const apiKeyValida = process.env.BUYER_API_KEY
      ? validarApiKey(request, process.env.BUYER_API_KEY)
      : false;

    if (!apiKeyValida) {
      return NextResponse.json(
        { error: "API key invalida" },
        { status: 401 },
      );
    }

    const comprador = await obtenerUsuarioClerk(body.idComprador);

    if (!comprador) {
      return NextResponse.json(
        { error: "Comprador inexistente en Clerk" },
        { status: 404 },
      );
    }

    const rolComprador =
      obtenerRolUsuario(comprador.publicMetadata) ??
      obtenerRolUsuario(comprador.privateMetadata);

    if (rolComprador !== "buyer") {
      return NextResponse.json(
        { error: "El usuario de Clerk no tiene rol buyer" },
        { status: 403 },
      );
    }

    const origen = new URL(request.url).origin;
    const idVendedor = await obtenerIdVendedor(body.idEvento, origen);
    const comision = calcularComisionVenta(body.monto);

    await prisma.vendedor.upsert({
      where: { id_vendedor: idVendedor },
      update: {
        nombre: `Vendedor Sandbox Evento ${body.idEvento}`,
        email: `vendedor.${idVendedor}@eventia.test`,
      },
      create: {
        id_vendedor: idVendedor,
        nombre: `Vendedor Sandbox Evento ${body.idEvento}`,
        email: `vendedor.${idVendedor}@eventia.test`,
      },
    });

    const transaccion = await prisma.transaccion.create({
      data: {
        id_pedido: body.idPedido,
        id_comprador: body.idComprador,
        id_vendedor: idVendedor,
        monto: body.monto,
        moneda: "ARS",
      },
    });

    const referenciaPago = String(transaccion.id_transaccion);
    const respuestaPreferencia = await crearPreferenciaPago({
      idTransaccion: transaccion.id_transaccion,
      idPedido: body.idPedido,
      monto: comision.montoTotalComprador,
      origen,
    });

    if (!respuestaPreferencia?.id) {
      throw new Error("No se pudo crear la preferencia de pago");
    }

    const transaccionActualizada = await prisma.transaccion.update({
      where: { id_transaccion: transaccion.id_transaccion },
      data: {
        id_preferencia_pago: respuestaPreferencia.id,
        referencia_pago: referenciaPago,
        estado_proveedor: "preferencia_creada",
      },
    });

    return NextResponse.json(
      {
        idTransaccion: transaccionActualizada.id_transaccion,
        idPedido: transaccionActualizada.id_pedido,
        preferenceId: respuestaPreferencia.id,
        estado: transaccionActualizada.estado_transaccion,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creando nueva transaccion:", error);

    return NextResponse.json(
      {
        error: "No se pudo crear la transaccion",
        detalle:
          process.env.NODE_ENV === "development"
            ? obtenerMensajeError(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
