import prisma from "@/lib/db/prisma";
import { EstadoTransaccion, Prisma } from "@prisma/client";
import { calcularComisionVenta } from "@/lib/payments/comisiones";
import type { DashboardAdminData, TransaccionAdmin } from "../types";
import type { AdminSearchParams } from "./admin-filters";
import { obtenerQueryAdmin } from "./admin-filters";
import {
  estadoAdminDesdePrisma,
  estadoPrismaDesdeAdmin,
  formatearFecha,
  formatearMonto,
} from "./admin-formatters";

type VendedorDb = Prisma.VendedorGetPayload<{
  select: {
    id_vendedor: true;
    nombre: true;
    email: true;
  };
}>;
type TransaccionAdminDb = Prisma.TransaccionGetPayload<{
  include: {
    venta: {
      select: {
        monto_bruto: true;
      };
    };
  };
}>;

function crearWhereBusqueda(
  search: string,
  vendedores: VendedorDb[],
): Prisma.TransaccionWhereInput | undefined {
  const termino = search.trim();

  if (!termino) return undefined;

  const terminoNormalizado = termino.toLowerCase();
  const idPedido = Number(termino.replace("#", ""));
  const vendedoresCoincidentes = vendedores
    .filter((vendedor) => {
      return (
        vendedor.id_vendedor.toLowerCase().includes(terminoNormalizado) ||
        vendedor.nombre.toLowerCase().includes(terminoNormalizado) ||
        vendedor.email.toLowerCase().includes(terminoNormalizado)
      );
    })
    .map((vendedor) => vendedor.id_vendedor);

  const condiciones: Prisma.TransaccionWhereInput[] = [
    { id_comprador: { contains: termino, mode: "insensitive" } },
    { id_vendedor: { contains: termino, mode: "insensitive" } },
  ];

  if (Number.isInteger(idPedido)) {
    condiciones.push({ id_pedido: idPedido });
  }

  if (vendedoresCoincidentes.length > 0) {
    condiciones.push({ id_vendedor: { in: vendedoresCoincidentes } });
  }

  return { OR: condiciones };
}

function mapearTransaccionesAdmin(
  transacciones: TransaccionAdminDb[],
): TransaccionAdmin[] {
  return transacciones.map((transaccion) => {
    const totalComprador =
      transaccion.venta?.monto_bruto ??
      calcularComisionVenta(transaccion.monto).montoTotalComprador;
    const montoTabla =
      transaccion.estado_transaccion === EstadoTransaccion.CANCELADA
        ? -Math.abs(Number(totalComprador))
        : totalComprador;

    return {
      pedido: `#${transaccion.id_pedido}`,
      idComprador: transaccion.id_comprador,
      vendedor: transaccion.id_vendedor,
      monto: formatearMonto(Number(montoTabla)),
      estado: estadoAdminDesdePrisma(transaccion.estado_transaccion),
      fecha: formatearFecha(transaccion.creado_en),
    };
  });
}

export async function obtenerDashboardAdmin(
  params: AdminSearchParams,
): Promise<DashboardAdminData> {
  const query = obtenerQueryAdmin(params);
  const skip = (query.page - 1) * query.perPage;

  const vendedoresDb = await prisma.vendedor.findMany({
    orderBy: { creado_en: "desc" },
    select: {
      id_vendedor: true,
      nombre: true,
      email: true,
    },
  });

  const vendedores = vendedoresDb.map((vendedor) => ({
    id: vendedor.id_vendedor,
    nombre: vendedor.nombre,
  }));

  const whereMetricas: Prisma.TransaccionWhereInput = query.vendedor
    ? { id_vendedor: query.vendedor }
    : {};

  const whereTransacciones: Prisma.TransaccionWhereInput = {
    ...whereMetricas,
    ...(query.estado === "todas"
      ? {}
      : { estado_transaccion: estadoPrismaDesdeAdmin(query.estado) }),
    ...crearWhereBusqueda(query.search, vendedoresDb),
  };
  const whereVentasAprobadas: Prisma.VentaWhereInput = {
    ...(query.vendedor ? { id_vendedor: query.vendedor } : {}),
    transaccion: {
      estado_transaccion: EstadoTransaccion.APROBADA,
    },
  };

  const [
    total,
    transaccionesDb,
    totalTransaccionesMetricas,
    pagosAprobados,
    ventasRegistradas,
    vendedoresActivos,
    resumenVentas,
  ] = await Promise.all([
    prisma.transaccion.count({ where: whereTransacciones }),
    prisma.transaccion.findMany({
      where: whereTransacciones,
      orderBy: { creado_en: "desc" },
      skip,
      take: query.perPage,
      include: {
        venta: {
          select: {
            monto_bruto: true,
          },
        },
      },
    }),
    prisma.transaccion.count({ where: whereMetricas }),
    prisma.transaccion.count({
      where: {
        ...whereMetricas,
        estado_transaccion: EstadoTransaccion.APROBADA,
      },
    }),
    prisma.venta.count({ where: whereVentasAprobadas }),
    prisma.transaccion.findMany({
      where: whereMetricas,
      distinct: ["id_vendedor"],
      select: { id_vendedor: true },
    }),
    prisma.venta.aggregate({
      where: whereVentasAprobadas,
      _sum: {
        monto_neto_vendedor: true,
        monto_comision: true,
      },
    }),
  ]);

  const tasaAprobacion =
    totalTransaccionesMetricas === 0
      ? 0
      : Math.round((pagosAprobados / totalTransaccionesMetricas) * 100);
  const montoVentas = resumenVentas._sum.monto_neto_vendedor ?? 0;
  const comisionEventia = resumenVentas._sum.monto_comision ?? 0;

  return {
    metricas: [
      {
        titulo: "Vendedores activos",
        valor: String(vendedoresActivos.length),
        detalle: query.vendedor
          ? "Filtro aplicado"
          : "Con transacciones registradas",
      },
      {
        titulo: "Ventas totales",
        valor: String(ventasRegistradas),
        detalle: "Transacciones aprobadas",
      },
      {
        titulo: "Monto de ventas",
        valor: formatearMonto(Number(montoVentas)),
        detalle: `${tasaAprobacion}% de pagos aprobados`,
      },
      {
        titulo: "Comision Eventia",
        valor: formatearMonto(Number(comisionEventia)),
        detalle: "Retencion sobre ventas aprobadas",
      },
    ],
    transacciones: mapearTransaccionesAdmin(transaccionesDb),
    vendedores,
    query,
    total,
  };
}
