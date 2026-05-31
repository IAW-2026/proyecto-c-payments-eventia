import prisma from "@/lib/db/prisma";
import { calcularComisionVenta } from "@/lib/payments/comisiones";

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

export function obtenerMontoTotalComprador(
  transaccion: TransaccionComprador,
) {
  return (
    transaccion.venta?.monto_bruto ??
    calcularComisionVenta(transaccion.monto).montoTotalComprador
  );
}

export async function obtenerUltimasTransaccionesComprador(idComprador: string) {
  const transacciones = await consultarUltimasTransaccionesComprador(
    idComprador,
  );

  return transacciones.map((transaccion) => ({
    id_transaccion: transaccion.id_transaccion,
    id_pedido: transaccion.id_pedido,
    montoTotalComprador: obtenerMontoTotalComprador(transaccion),
    estado_transaccion: transaccion.estado_transaccion,
  }));
}
