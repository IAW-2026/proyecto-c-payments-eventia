import prisma from "@/lib/db/prisma";
import { EstadoTransaccion, Prisma } from "@prisma/client";
import type { DashboardAdminData, TransaccionAdmin } from "../types";
import type { AdminSearchParams } from "./admin-filters";
import { obtenerQueryAdmin } from "./admin-filters";
import {
  estadoAdminDesdePrisma,
  estadoPrismaDesdeAdmin,
  formatearFecha,
  formatearMonto,
} from "./admin-formatters";

type VendedorDb = Awaited<ReturnType<typeof prisma.vendedor.findMany>>[number];

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
  transacciones: Awaited<ReturnType<typeof prisma.transaccion.findMany>>,
  vendedoresPorId: Map<string, VendedorDb>,
): TransaccionAdmin[] {
  return transacciones.map((transaccion) => {
    const vendedor = vendedoresPorId.get(transaccion.id_vendedor);

    return {
      pedido: `#${transaccion.id_pedido}`,
      comprador: transaccion.id_comprador,
      vendedor: vendedor?.nombre ?? transaccion.id_vendedor,
      monto: formatearMonto(transaccion.monto),
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
  });

  const vendedores = vendedoresDb.map((vendedor) => ({
    id: vendedor.id_vendedor,
    nombre: vendedor.nombre,
  }));

  const vendedoresPorId = new Map(
    vendedoresDb.map((vendedor) => [vendedor.id_vendedor, vendedor]),
  );

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

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const [
    total,
    transaccionesDb,
    totalTransaccionesMetricas,
    pagosAprobados,
    pagosPendientes,
    ventasRegistradas,
    ventasHoy,
    vendedoresActivos,
  ] = await Promise.all([
    prisma.transaccion.count({ where: whereTransacciones }),
    prisma.transaccion.findMany({
      where: whereTransacciones,
      orderBy: { creado_en: "desc" },
      skip,
      take: query.perPage,
    }),
    prisma.transaccion.count({ where: whereMetricas }),
    prisma.transaccion.count({
      where: {
        ...whereMetricas,
        estado_transaccion: EstadoTransaccion.APROBADA,
      },
    }),
    prisma.transaccion.count({
      where: {
        ...whereMetricas,
        estado_transaccion: EstadoTransaccion.PENDIENTE,
      },
    }),
    prisma.venta.count({
      where: query.vendedor ? { id_vendedor: query.vendedor } : {},
    }),
    prisma.venta.count({
      where: {
        ...(query.vendedor ? { id_vendedor: query.vendedor } : {}),
        fecha_venta: { gte: inicioHoy },
      },
    }),
    prisma.transaccion.findMany({
      where: whereMetricas,
      distinct: ["id_vendedor"],
      select: { id_vendedor: true },
    }),
  ]);

  const tasaAprobacion =
    totalTransaccionesMetricas === 0
      ? 0
      : Math.round((pagosAprobados / totalTransaccionesMetricas) * 100);

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
        titulo: "Entradas vendidas",
        valor: String(ventasRegistradas),
        detalle: `${ventasHoy} ventas hoy`,
      },
      {
        titulo: "Pagos aprobados",
        valor: `${tasaAprobacion}%`,
        detalle: "Tasa de aprobacion",
      },
      {
        titulo: "Pagos pendientes",
        valor: String(pagosPendientes),
        detalle: "Requieren seguimiento",
      },
    ],
    transacciones: mapearTransaccionesAdmin(transaccionesDb, vendedoresPorId),
    vendedores,
    query,
    total,
  };
}
