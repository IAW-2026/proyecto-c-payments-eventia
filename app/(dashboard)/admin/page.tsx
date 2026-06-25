import TransaccionesAdmin from "./_components/TransaccionesAdmin";
import { obtenerDashboardAdmin } from "./_lib/admin-data";
import type { AdminSearchParams } from "./_lib/admin-filters";

type AdminPageProps = {
  searchParams: Promise<AdminSearchParams>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const dashboard = await obtenerDashboardAdmin(await searchParams);

  return (
    <main className="layout-container">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div>
            <span className="chip-retro">Administracion</span>
            <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
              Panel de administrador
            </h1>
            <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
              Monitorea pagos, eventos, integraciones y actividad reciente desde
              una vista centralizada.
            </p>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboard.metricas.map((metrica) => (
            <article key={metrica.titulo} className="card-retro">
              <p className="text-label-lg text-on-surface-variant">
                {metrica.titulo}
              </p>
              <strong className="mt-4 block text-headline-md text-primary">
                {metrica.valor}
              </strong>
              <span className="mt-3 block text-body-md text-on-surface-variant">
                {metrica.detalle}
              </span>
            </article>
          ))}
        </section>

        <section>
          <TransaccionesAdmin
            transacciones={dashboard.transacciones}
            vendedores={dashboard.vendedores}
            query={dashboard.query}
            total={dashboard.total}
          />
        </section>
      </section>
    </main>
  );
}
