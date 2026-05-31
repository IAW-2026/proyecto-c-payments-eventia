import { protegerRutaPorRol } from "@/lib/auth/guards";
import PanelVendedor from "./_components/PanelVendedor";
import { obtenerDashboardVendedor } from "./_lib/vendedor-data";

export default async function VendedorPage() {
  const { user } = await protegerRutaPorRol(["seller"]);
  const dashboard = await obtenerDashboardVendedor(user.id);

  return (
    <main className="layout-container">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8">
          <span className="chip-retro">Vendedor</span>
          <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
            Acreditaciones vendedor
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            Consulta ventas aprobadas, comisiones retenidas y el monto neto
            pendiente de acreditacion.
          </p>
        </header>

        <PanelVendedor dashboard={dashboard} />
      </section>
    </main>
  );
}
