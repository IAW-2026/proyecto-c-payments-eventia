import type { EstadoTransaccion } from "@prisma/client";

export type EstadoTransaccionVendedor =
  | "aprobada"
  | "pendiente"
  | "fallida"
  | "cancelada";

export type EstadoFiltroVendedor = "todas" | EstadoTransaccionVendedor;

export type MetricaVendedor = {
  titulo: string;
  valor: string;
  detalle: string;
};

export type TransaccionVendedor = {
  pedido: string;
  idComprador: string;
  montoComprador: string;
  netoVendedor: string;
  estado: EstadoTransaccion;
  fecha: string;
};

export type QueryVendedor = {
  estado: EstadoFiltroVendedor;
  page: number;
  perPage: number;
};

export type DashboardVendedorData = {
  metricas: MetricaVendedor[];
  transacciones: TransaccionVendedor[];
  query: QueryVendedor;
  total: number;
};
