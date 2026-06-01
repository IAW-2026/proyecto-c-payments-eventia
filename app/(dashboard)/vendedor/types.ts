import type { EstadoTransaccion } from "@prisma/client";

export type MetricaVendedor = {
  titulo: string;
  valor: string;
  detalle: string;
};

export type TransaccionVendedor = {
  pedido: string;
  comprador: string;
  montoComprador: string;
  netoVendedor: string;
  estado: EstadoTransaccion;
  fecha: string;
};

export type DashboardVendedorData = {
  metricas: MetricaVendedor[];
  transacciones: TransaccionVendedor[];
};
