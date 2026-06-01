import type { DashboardVendedorData } from "../types";
import MetricasVendedor from "./MetricasVendedor";
import PaginacionTransaccionesVendedor from "./PaginacionTransaccionesVendedor";
import TablaTransaccionesVendedor from "./TablaTransaccionesVendedor";

type PanelVendedorProps = {
  dashboard: DashboardVendedorData;
};

export default function PanelVendedor({ dashboard }: PanelVendedorProps) {
  const totalPaginas = Math.max(
    1,
    Math.ceil(dashboard.total / dashboard.query.perPage),
  );

  return (
    <>
      <MetricasVendedor metricas={dashboard.metricas} />
      <TablaTransaccionesVendedor
        transacciones={dashboard.transacciones}
        query={dashboard.query}
        total={dashboard.total}
      />
      <PaginacionTransaccionesVendedor
        query={dashboard.query}
        totalPaginas={totalPaginas}
      />
    </>
  );
}
