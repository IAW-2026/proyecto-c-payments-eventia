import prisma from "@/lib/db/prisma";
import { EstadoTransaccion } from "@prisma/client";
import { calcularComisionVenta } from "@/lib/payments/comisiones";

const MINUTOS_VIGENCIA_CHECKOUT = 15;

type TransaccionComprador = Awaited<
  ReturnType<typeof consultarUltimasTransaccionesComprador>
>[number];

function consultarUltimasTransaccionesComprador(idComprador: string) {
  return prisma.transaccion.findMany({
    where: {
      id_comprador: idComprador,
    },
    orderBy: { creado_en: "desc" },
    take: 3,
    select: {
      id_transaccion: true,
      id_pedido: true,
      monto: true,
      estado_transaccion: true,
      venta: {
        select: {
          monto_bruto: true,
        },
      },
    },
  });
}

function consultarUltimaTransaccionPendiente(idComprador: string) {
  const fechaMinima = new Date(
    Date.now() - MINUTOS_VIGENCIA_CHECKOUT * 60 * 1000,
  );

  return prisma.transaccion.findFirst({
    where: {
      id_comprador: idComprador,
      estado_transaccion: EstadoTransaccion.PENDIENTE,
      estado_proveedor: "preferencia_creada",
      creado_en: {
        gte: fechaMinima,
      },
      id_preferencia_pago: {
        not: null,
      },
    },
    orderBy: { creado_en: "desc" },
    select: {
      id_transaccion: true,
      id_pedido: true,
      monto: true,
      estado_transaccion: true,
      venta: {
        select: {
          monto_bruto: true,
        },
      },
    },
  });
}

export function obtenerMontoTotalComprador(
  transaccion: TransaccionComprador,
) {
  return (
    transaccion.venta?.monto_bruto ??
    calcularComisionVenta(transaccion.monto).montoTotalComprador
  );
}

export async function obtenerUltimasTransaccionesComprador(idComprador: string) {
  const [transacciones, transaccionPendiente] = await Promise.all([
    consultarUltimasTransaccionesComprador(idComprador),
    consultarUltimaTransaccionPendiente(idComprador),
  ]);

  return {
    transaccionPendiente: transaccionPendiente
      ? {
          id_transaccion: transaccionPendiente.id_transaccion,
          id_pedido: transaccionPendiente.id_pedido,
          montoTotalComprador: obtenerMontoTotalComprador(transaccionPendiente),
          estado_transaccion: transaccionPendiente.estado_transaccion,
        }
      : null,
    ultimasTransacciones: transacciones.map((transaccion) => ({
      id_transaccion: transaccion.id_transaccion,
      id_pedido: transaccion.id_pedido,
      montoTotalComprador: obtenerMontoTotalComprador(transaccion),
      estado_transaccion: transaccion.estado_transaccion,
    })),
  };
}
