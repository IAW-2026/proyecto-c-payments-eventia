export type EstadoTransaccionAdmin =
  | "aprobada"
  | "pendiente"
  | "fallida"
  | "cancelada";

export type EstadoFiltroAdmin = "todas" | EstadoTransaccionAdmin;

export type QueryAdmin = {
  search: string;
  estado: EstadoFiltroAdmin;
  vendedor: string;
  page: number;
  perPage: number;
};

export type VendedorAdmin = {
  id: string;
  nombre: string;
};

export type TransaccionAdmin = {
  pedido: string;
  comprador: string;
  vendedor: string;
  monto: string;
  estado: EstadoTransaccionAdmin;
  fecha: string;
};

export type MetricaAdmin = {
  titulo: string;
  valor: string;
  detalle: string;
};

export type DashboardAdminData = {
  metricas: MetricaAdmin[];
  transacciones: TransaccionAdmin[];
  vendedores: VendedorAdmin[];
  query: QueryAdmin;
  total: number;
};
