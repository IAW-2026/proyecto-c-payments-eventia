import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/app/lib/prisma";

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
  if (status === "approved") return "APROBADA";
  if (status === "rejected" || status === "cancelled") {
    return "CANCELADA";
  }

  return "PENDIENTE";
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

    const transaccion = await prisma.transaccion.update({
      where: { referencia_pago: referenciaPago },
      data: {
        id_pago_proveedor: String(datosPago.id),
        estado_proveedor: datosPago.status,
        estado_transaccion: mapearEstadoTransaccion(datosPago.status),
      },
    });

    if (datosPago.status === "approved") {
      await prisma.venta.upsert({
        where: { id_transaccion: transaccion.id_transaccion },
        update: {},
        create: {
          id_transaccion: transaccion.id_transaccion,
          id_vendedor: transaccion.id_vendedor,
        },
      });
    }

    console.log(
      `Pago ${dataId} procesado para transaccion ${transaccion.id_transaccion}: ${datosPago.status}`,
    );

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error procesando el webhook:", error);

    return new NextResponse("Error interno procesado", { status: 200 });
  }
}
