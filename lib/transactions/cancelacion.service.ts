import "server-only";

import { EstadoTransaccion } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { ErrorRespuestaHttp } from "@/lib/http/api-error";
import { notificarEstadoTransaccion } from "@/lib/payments/notificaciones";
import { validarApiKey } from "@/lib/auth/apiKey";
import { z } from "zod";

const pedidoCanceladoSchema = z.object({
  idPedido: z.number().int().positive(),
});

export async function cancelarPedidoPorId(idPedido: number, origen: string) {
  const transaccionExistente = await prisma.transaccion.findUnique({
    where: { id_pedido: idPedido },
  });

  if (!transaccionExistente) {
    throw new ErrorRespuestaHttp(404, {
      error: "Transaccion no encontrada",
    });
  }

  if (transaccionExistente.estado_transaccion !== EstadoTransaccion.APROBADA) {
    throw new ErrorRespuestaHttp(409, {
      error: "Solo se pueden cancelar transacciones aprobadas",
    });
  }

  const transaccion = await prisma.transaccion.update({
    where: { id_transaccion: transaccionExistente.id_transaccion },
    data: {
      estado_transaccion: EstadoTransaccion.CANCELADA,
      estado_proveedor: "cancelada_por_buyer",
    },
  });

  await notificarEstadoTransaccion({
    origen,
    destinos: ["seller"],
    payload: {
      idPedido: transaccion.id_pedido,
      estadoTransaccion: "CANCELADA",
    },
  });
}

export async function cancelarPedido(request: Request) {
  if (!validarApiKey(request, process.env.BUYER_API_KEY)) {
    throw new ErrorRespuestaHttp(401, {
      error: "API key invalida",
    });
  }

  const body = await request.json();
  const resultado = pedidoCanceladoSchema.safeParse(body);

  if (!resultado.success) {
    throw new ErrorRespuestaHttp(400, {
      error: "Datos de pedido cancelado invalidos",
    });
  }

  const { idPedido } = resultado.data;
  const origen = new URL(request.url).origin;

  await cancelarPedidoPorId(idPedido, origen);
}
