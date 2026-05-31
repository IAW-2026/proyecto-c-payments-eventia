import type { DashboardVendedorData } from "../types";
import MetricasVendedor from "./MetricasVendedor";
import TablaTransaccionesVendedor from "./TablaTransaccionesVendedor";

type PanelVendedorProps = {
  dashboard: DashboardVendedorData;
};

export default function PanelVendedor({ dashboard }: PanelVendedorProps) {
  return (
    <>
      <MetricasVendedor metricas={dashboard.metricas} />
      <TablaTransaccionesVendedor transacciones={dashboard.transacciones} />
    </>
  );
}
