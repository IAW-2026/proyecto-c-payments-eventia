import TransaccionesAdmin, {
  EstadoTransaccionAdmin,
  TransaccionAdmin,
} from "./TransaccionesAdmin";

const metricas = [
  { titulo: "Eventos activos", valor: "12", detalle: "3 publicados esta semana" },
  { titulo: "Entradas vendidas", valor: "248", detalle: "18 ventas hoy" },
  { titulo: "Pagos aprobados", valor: "96%", detalle: "Tasa de aprobacion" },
  { titulo: "Pagos pendientes", valor: "7", detalle: "Requieren seguimiento" },
];

const transacciones: TransaccionAdmin[] = [
  {
    pedido: "#1008",
    comprador: "Camila Torres",
    vendedor: "Taller Norte",
    monto: "$12.000",
    estado: "aprobada",
    fecha: "Hoy, 14:20",
  },
  {
    pedido: "#1007",
    comprador: "Sofia Marin",
    vendedor: "Eventia Studio",
    monto: "$5.000",
    estado: "pendiente",
    fecha: "Hoy, 13:48",
  },
  {
    pedido: "#1006",
    comprador: "Lucia Perez",
    vendedor: "Casa Botanica",
    monto: "$8.500",
    estado: "fallida",
    fecha: "Ayer, 19:12",
  },
];

type AdminPageProps = {
  searchParams: Promise<{
    search?: string | string[];
    estado?: string | string[];
    page?: string | string[];
    perPage?: string | string[];
  }>;
};

function primerValor(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizarEstado(value?: string): "todas" | EstadoTransaccionAdmin {
  if (value === "aprobada" || value === "pendiente" || value === "fallida") {
    return value;
  }

  return "todas";
}

function normalizarNumero(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const search = primerValor(params.search) ?? "";
  const estado = normalizarEstado(primerValor(params.estado));
  const page = normalizarNumero(primerValor(params.page), 1);
  const perPage = normalizarNumero(primerValor(params.perPage), 10);

  return (
    <main className="layout-container">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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
          <div className="chip-retro gap-2">
            <span className="h-2 w-2 rounded-full bg-on-secondary-container" />
            Sistema activo
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricas.map((metrica) => (
            <article
              key={metrica.titulo}
              className="card-retro"
            >
              <p className="text-label-lg text-on-surface-variant">{metrica.titulo}</p>
              <strong className="mt-4 block text-headline-md text-primary">
                {metrica.valor}
              </strong>
              <span className="mt-3 block text-body-md text-on-surface-variant">
                {metrica.detalle}
              </span>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <TransaccionesAdmin
            transacciones={transacciones}
            query={{ search, estado, page, perPage }}
            total={248}
          />

          <aside className="grid gap-6">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-headline-md text-on-background">
                Acciones rapidas
              </h2>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Tareas frecuentes.
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  "Ver transacciones",
                  "Revisar pagos fallidos",
                  "Administrar vendedores",
                  "Ver eventos activos",
                ].map((accion) => (
                  <button
                    type="button"
                    key={accion}
                    className="btn-retro-secondary text-left"
                  >
                    {accion}
                  </button>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}
