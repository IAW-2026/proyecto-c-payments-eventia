import prisma from "@/lib/db/prisma";

export function obtenerUltimasTransaccionesComprador(idComprador: string) {
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
    },
  });
}
