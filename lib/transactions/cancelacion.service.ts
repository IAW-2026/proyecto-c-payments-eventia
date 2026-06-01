import prisma from "@/lib/db/prisma";
import { ErrorRespuestaHttp } from "@/lib/http/api-error";
import { notificarEstadoTransaccion } from "@/lib/payments/notificaciones";
import { validarApiKey } from "@/lib/auth/apiKey";
import { z } from "zod";

const pedidoCanceladoSchema = z.object({
  idPedido: z.number().int().positive(),
});

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

  const transaccionExistente = await prisma.transaccion.findUnique({
    where: { id_pedido: idPedido },
  });

  if (!transaccionExistente) {
    throw new ErrorRespuestaHttp(404, {
      error: "Transaccion no encontrada",
    });
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
}
