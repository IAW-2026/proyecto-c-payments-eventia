import { EstadoTransaccion } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { formatearFecha } from "@/lib/formatters/fecha";
import { formatearMonto } from "@/lib/formatters/moneda";
import { calcularComisionVenta } from "@/lib/payments/comisiones";
import type { DashboardVendedorData, TransaccionVendedor } from "../types";

type TransaccionVendedorDb = Awaited<
  ReturnType<typeof consultarUltimasTransaccionesVendedor>
>[number];

function consultarUltimasTransaccionesVendedor(idVendedor: string) {
  return prisma.transaccion.findMany({
    where: {
      id_vendedor: idVendedor,
    },
    orderBy: { creado_en: "desc" },
    take: 5,
    select: {
      id_pedido: true,
      id_comprador: true,
      monto: true,
      estado_transaccion: true,
      creado_en: true,
      venta: {
        select: {
          monto_bruto: true,
          monto_comision: true,
          monto_neto_vendedor: true,
        },
      },
    },
  });
}

function obtenerSnapshotFinanciero(transaccion: TransaccionVendedorDb) {
  const snapshotCalculado = calcularComisionVenta(transaccion.monto);

  return {
    montoComprador:
      transaccion.venta?.monto_bruto ?? snapshotCalculado.montoTotalComprador,
    comisionEventia:
      transaccion.venta?.monto_comision ?? snapshotCalculado.montoComision,
    netoVendedor:
      transaccion.venta?.monto_neto_vendedor ??
      snapshotCalculado.montoNetoVendedor,
  };
}

function mapearTransaccionVendedor(
  transaccion: TransaccionVendedorDb,
): TransaccionVendedor {
  const snapshot = obtenerSnapshotFinanciero(transaccion);

  return {
    pedido: `#${transaccion.id_pedido}`,
    comprador: transaccion.id_comprador,
    montoComprador: formatearMonto(snapshot.montoComprador),
    comisionEventia: formatearMonto(snapshot.comisionEventia),
    netoVendedor: formatearMonto(snapshot.netoVendedor),
    estado: transaccion.estado_transaccion,
    fecha: formatearFecha(transaccion.creado_en),
  };
}

export async function obtenerDashboardVendedor(
  idVendedor: string,
): Promise<DashboardVendedorData> {
  const whereVentasAprobadas = {
    id_vendedor: idVendedor,
    transaccion: {
      estado_transaccion: EstadoTransaccion.APROBADA,
    },
  };

  const [
    ventasAprobadas,
    resumenAcreditaciones,
    ultimasTransacciones,
  ] = await Promise.all([
    prisma.venta.count({
      where: whereVentasAprobadas,
    }),
    prisma.venta.aggregate({
      where: whereVentasAprobadas,
      _sum: {
        monto_neto_vendedor: true,
        monto_comision: true,
      },
    }),
    consultarUltimasTransaccionesVendedor(idVendedor),
  ]);

  const netoAcreditar = resumenAcreditaciones._sum.monto_neto_vendedor ?? 0;
  const comisionesEventia = resumenAcreditaciones._sum.monto_comision ?? 0;

  return {
    metricas: [
      {
        titulo: "Ventas aprobadas",
        valor: String(ventasAprobadas),
        detalle: "Operaciones confirmadas",
      },
      {
        titulo: "Neto a acreditar",
        valor: formatearMonto(netoAcreditar),
        detalle: "Importe correspondiente al vendedor",
      },
      {
        titulo: "Comisiones Eventia",
        valor: formatearMonto(comisionesEventia),
        detalle: "Comision retenida por la plataforma",
      },
    ],
    transacciones: ultimasTransacciones.map(mapearTransaccionVendedor),
  };
}
