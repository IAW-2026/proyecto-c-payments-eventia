import { EstadoTransaccion, Prisma } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { formatearFecha } from "@/lib/formatters/fecha";
import { formatearMonto } from "@/lib/formatters/moneda";
import { calcularComisionVenta } from "@/lib/payments/comisiones";
import type { DashboardVendedorData, TransaccionVendedor } from "../types";
import type { VendedorSearchParams } from "./vendedor-filters";
import { obtenerQueryVendedor } from "./vendedor-filters";
import { estadoPrismaDesdeVendedor } from "./vendedor-formatters";

type TransaccionVendedorDb = Awaited<
  ReturnType<typeof consultarTransaccionesVendedor>
>[number];

function consultarTransaccionesVendedor({
  idVendedor,
  estadoTransaccion,
  skip,
  take,
}: {
  idVendedor: string;
  estadoTransaccion?: EstadoTransaccion;
  skip: number;
  take: number;
}) {
  return prisma.transaccion.findMany({
    where: {
      id_vendedor: idVendedor,
      ...(estadoTransaccion ? { estado_transaccion: estadoTransaccion } : {}),
    },
    orderBy: { creado_en: "desc" },
    skip,
    take,
    select: {
      id_pedido: true,
      id_comprador: true,
      monto: true,
      estado_transaccion: true,
      creado_en: true,
      venta: {
        select: {
          monto_bruto: true,
          monto_neto_vendedor: true,
        },
      },
    },
  });
}

function obtenerSnapshotFinanciero(transaccion: TransaccionVendedorDb) {
  const snapshotCalculado = calcularComisionVenta(transaccion.monto);
  const montoComprador =
    transaccion.venta?.monto_bruto ?? snapshotCalculado.montoTotalComprador;
  const netoVendedor =
    transaccion.venta?.monto_neto_vendedor ??
    snapshotCalculado.montoNetoVendedor;

  if (transaccion.estado_transaccion === EstadoTransaccion.CANCELADA) {
    return {
      montoComprador: -Math.abs(Number(montoComprador)),
      netoVendedor: -Math.abs(Number(netoVendedor)),
    };
  }

  return {
    montoComprador,
    netoVendedor,
  };
}

function mapearTransaccionVendedor(
  transaccion: TransaccionVendedorDb,
): TransaccionVendedor {
  const snapshot = obtenerSnapshotFinanciero(transaccion);

  return {
    pedido: `#${transaccion.id_pedido}`,
    idComprador: transaccion.id_comprador,
    montoComprador: formatearMonto(snapshot.montoComprador),
    netoVendedor: formatearMonto(snapshot.netoVendedor),
    estado: transaccion.estado_transaccion,
    fecha: formatearFecha(transaccion.creado_en),
  };
}

export async function obtenerDashboardVendedor(
  idVendedor: string,
  params: VendedorSearchParams,
): Promise<DashboardVendedorData> {
  const query = obtenerQueryVendedor(params);
  const skip = (query.page - 1) * query.perPage;
  const estadoTransaccion = estadoPrismaDesdeVendedor(query.estado);
  const whereTransacciones: Prisma.TransaccionWhereInput = {
    id_vendedor: idVendedor,
    ...(estadoTransaccion ? { estado_transaccion: estadoTransaccion } : {}),
  };
  const whereVentasAprobadas: Prisma.VentaWhereInput = {
    id_vendedor: idVendedor,
    transaccion: {
      estado_transaccion: EstadoTransaccion.APROBADA,
    },
  };

  const [
    ventasAprobadas,
    resumenAcreditaciones,
    totalTransacciones,
    transacciones,
  ] = await Promise.all([
    prisma.venta.count({
      where: whereVentasAprobadas,
    }),
    prisma.venta.aggregate({
      where: whereVentasAprobadas,
      _sum: {
        monto_neto_vendedor: true,
      },
    }),
    prisma.transaccion.count({
      where: whereTransacciones,
    }),
    consultarTransaccionesVendedor({
      idVendedor,
      estadoTransaccion,
      skip,
      take: query.perPage,
    }),
  ]);

  const netoAcreditar = resumenAcreditaciones._sum.monto_neto_vendedor ?? 0;
  const promedioPorVenta =
    ventasAprobadas === 0 ? 0 : Math.round(netoAcreditar / ventasAprobadas);

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
        titulo: "Promedio por venta",
        valor: formatearMonto(promedioPorVenta),
        detalle: "Ticket neto promedio",
      },
    ],
    transacciones: transacciones.map(mapearTransaccionVendedor),
    query,
    total: totalTransacciones,
  };
}
