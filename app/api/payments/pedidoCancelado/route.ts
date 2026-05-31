import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { validarApiKey } from "@/lib/auth/apiKey";
import { notificarEstadoTransaccion } from "@/lib/payments/notificaciones";
import { z } from "zod";

const pedidoCanceladoSchema = z.object({
  idPedido: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    if (!validarApiKey(request, process.env.BUYER_API_KEY)) {
      return NextResponse.json(
        { error: "API key invalida" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const resultado = pedidoCanceladoSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        { error: "Datos de pedido cancelado invalidos" },
        { status: 400 },
      );
    }

    const datos = resultado.data;

    const transaccionExistente = await prisma.transaccion.findUnique({
      where: { id_pedido: datos.idPedido },
    });

    if (!transaccionExistente) {
      return NextResponse.json(
        { error: "Transaccion no encontrada" },
        { status: 404 },
      );
    }

    const transaccion = await prisma.transaccion.update({
      where: { id_transaccion: transaccionExistente.id_transaccion },
      data: {
        estado_transaccion: "CANCELADA",
        estado_proveedor: "cancelada_por_buyer",
      },
    });

    const origen = new URL(request.url).origin;

    await notificarEstadoTransaccion({
      origen,
      destinos: ["seller"],
      payload: {
        idPedido: transaccion.id_pedido,
        estadoTransaccion: "CANCELADA",
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error procesando pedido cancelado:", error);

    return NextResponse.json(
      { error: "No se pudo procesar el pedido cancelado" },
      { status: 500 },
    );
  }
}
