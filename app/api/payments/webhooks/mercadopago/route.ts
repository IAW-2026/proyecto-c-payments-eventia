import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db/prisma";
import { EstadoTransaccion } from "@prisma/client";
import { notificarEstadoTransaccion } from "@/lib/payments/notificaciones";
import { calcularComisionVenta } from "@/lib/payments/comisiones";

type PagoMercadoPago = {
  id: number;
  status: string;
  external_reference?: string | null;
};

function obtenerFirma(xSignature: string) {
  const parts = xSignature.split(",");
  let ts: string | null = null;
  let hash: string | null = null;

  parts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key?.trim() === "ts") ts = value?.trim();
    if (key?.trim() === "v1") hash = value?.trim();
  });

  return { ts, hash };
}

function validarFirma({
  dataId,
  xRequestId,
  ts,
  hash,
}: {
  dataId: string;
  xRequestId: string;
  ts: string;
  hash: string;
}) {
  const secretMercadoPago = process.env.MP_WEBHOOK_SECRET;

  if (!secretMercadoPago) {
    throw new Error("MP_WEBHOOK_SECRET no esta definido");
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secretMercadoPago);
  hmac.update(manifest);

  return hmac.digest("hex") === hash;
}

function debeValidarFirmaEstricto() {
  return process.env.MP_WEBHOOK_STRICT_SIGNATURE === "true";
}

function mapearEstadoTransaccion(status: string) {
  if (status === "approved") return EstadoTransaccion.APROBADA;
  if (status === "rejected") return EstadoTransaccion.FALLIDA;
  if (status === "cancelled") return EstadoTransaccion.CANCELADA;

  return EstadoTransaccion.PENDIENTE;
}

async function actualizarTransaccionPago({
  referenciaPago,
  datosPago,
}: {
  referenciaPago: string;
  datosPago: PagoMercadoPago;
}) {
  const estadoTransaccion = mapearEstadoTransaccion(datosPago.status);
  const idPagoProveedor = String(datosPago.id);

  const resultadoActualizacion = await prisma.transaccion.updateMany({
    where: {
      referencia_pago: referenciaPago,
      NOT: {
        id_pago_proveedor: idPagoProveedor,
        estado_proveedor: datosPago.status,
        estado_transaccion: estadoTransaccion,
      },
    },
    data: {
      id_pago_proveedor: idPagoProveedor,
      estado_proveedor: datosPago.status,
      estado_transaccion: estadoTransaccion,
    },
  });

  const transaccion = await prisma.transaccion.findUnique({
    where: { referencia_pago: referenciaPago },
  });

  if (!transaccion) {
    throw new Error("No se encontro la transaccion asociada al pago");
  }

  return {
    transaccion,
    estadoTransaccion,
    fueActualizada: resultadoActualizacion.count > 0,
  };
}
    
async function consultarPago(dataId: string): Promise<PagoMercadoPago> {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("MP_ACCESS_TOKEN no esta definido");
  }

  const responsePago = await fetch(
    `https://api.mercadopago.com/v1/payments/${dataId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!responsePago.ok) {
    throw new Error("No se pudo verificar el pago en Mercado Pago");
  }

  return responsePago.json();
}

export async function POST(request: Request) {
  try {
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const type = searchParams.get("type") ?? topic;
    const dataId = searchParams.get("data.id") ?? (
      topic === "payment" ? searchParams.get("id") : null
    );

    if (!dataId || type !== "payment") {
      return new NextResponse("Notificacion ignorada", { status: 200 });
    }

    if (xSignature && xRequestId) {
      const { ts, hash } = obtenerFirma(xSignature);

      if (!ts || !hash) {
        return new NextResponse("Firma incompleta", { status: 401 });
      }

      const firmaValida = validarFirma({
        dataId,
        xRequestId,
        ts,
        hash,
      });

      if (!firmaValida) {
        console.error("Firma de notificacion invalida");

        if (debeValidarFirmaEstricto()) {
          return new NextResponse("Firma no coincide", { status: 401 });
        }
      }
    } else {
      console.warn("Webhook de Mercado Pago recibido sin firma");
    }

    const datosPago = await consultarPago(dataId);
    const referenciaPago = datosPago.external_reference;

    if (!referenciaPago) {
      console.error(`Pago ${dataId} sin external_reference`);
      return new NextResponse("Pago sin referencia", { status: 200 });
    }

    const {
      transaccion,
      estadoTransaccion,
      fueActualizada,
    } = await actualizarTransaccionPago({
      referenciaPago,
      datosPago,
    });

    if (!fueActualizada) {
      console.log(
        `Pago ${dataId} ya procesado para transaccion ${transaccion.id_transaccion}: ${datosPago.status}`,
      );

      return new NextResponse("OK", { status: 200 });
    }

    if (datosPago.status === "approved") {
      const comision = calcularComisionVenta(transaccion.monto);

      await prisma.venta.upsert({
        where: { id_transaccion: transaccion.id_transaccion },
        update: {
          monto_bruto: comision.montoBruto,
          porcentaje_comision: comision.porcentajeComision,
          monto_comision: comision.montoComision,
          monto_neto_vendedor: comision.montoNetoVendedor,
          moneda: transaccion.moneda,
        },
        create: {
          id_transaccion: transaccion.id_transaccion,
          id_vendedor: transaccion.id_vendedor,
          monto_bruto: comision.montoBruto,
          porcentaje_comision: comision.porcentajeComision,
          monto_comision: comision.montoComision,
          monto_neto_vendedor: comision.montoNetoVendedor,
          moneda: transaccion.moneda,
        },
      });
    }

    const origen = new URL(request.url).origin;

    await notificarEstadoTransaccion({
      origen,
      destinos: ["seller", "shipping"],
      payload: {
        idPedido: transaccion.id_pedido,
        estadoTransaccion,
      },
    });
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return new NextResponse("Error interno procesado", { status: 200 });
  }
}
