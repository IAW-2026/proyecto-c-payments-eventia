import Link from "next/link";

export type EstadoTransaccionAdmin = "aprobada" | "pendiente" | "fallida";

export type TransaccionAdmin = {
  pedido: string;
  comprador: string;
  vendedor: string;
  monto: string;
  estado: EstadoTransaccionAdmin;
  fecha: string;
};

type QueryAdmin = {
  search: string;
  estado: "todas" | EstadoTransaccionAdmin;
  page: number;
  perPage: number;
};

type TransaccionesAdminProps = {
  transacciones: TransaccionAdmin[];
  query: QueryAdmin;
  total: number;
};

const estados = [
  { label: "Todas", value: "todas" },
  { label: "Aprobadas", value: "aprobada" },
  { label: "Pendientes", value: "pendiente" },
  { label: "Fallidas", value: "fallida" },
] as const;

const perPageOptions = [10, 25, 50];

const estadoClases: Record<EstadoTransaccionAdmin, string> = {
  aprobada: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pendiente: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  fallida: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

function capitalizar(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function crearHref(
  query: QueryAdmin,
  cambios: Partial<Record<"search" | "estado" | "page" | "perPage", string | number>>,
) {
  const params = new URLSearchParams();
  const next = { ...query, ...cambios };

  if (next.search) params.set("search", String(next.search));
  if (next.estado && next.estado !== "todas") params.set("estado", String(next.estado));
  if (Number(next.page) > 1) params.set("page", String(next.page));
  if (Number(next.perPage) !== 10) params.set("perPage", String(next.perPage));

  const qs = params.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default function TransaccionesAdmin({
  transacciones,
  query,
  total,
}: TransaccionesAdminProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / query.perPage));
  const desde = total === 0 ? 0 : (query.page - 1) * query.perPage + 1;
  const hasta = Math.min(query.page * query.perPage, total);
  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1);

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-950">
              Ultimas transacciones
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Busca, filtra y navega la actividad reciente de pagos.
            </p>
          </div>

          <p className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
            Mostrando {desde}-{hasta} de {total}
          </p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(220px,1fr)_auto_auto]">
          <form action="/admin" className="relative">
            <input type="hidden" name="estado" value={query.estado === "todas" ? "" : query.estado} />
            <input type="hidden" name="perPage" value={query.perPage} />
            <input
              name="search"
              defaultValue={query.search}
              placeholder="Buscar por comprador, vendedor o pedido..."
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </form>

          <div className="flex flex-wrap gap-2">
            {estados.map((estado) => {
              const activo = query.estado === estado.value;

              return (
                <Link
                  key={estado.value}
                  href={crearHref(query, { estado: estado.value, page: 1 })}
                  className={`inline-flex h-11 items-center rounded-md px-3 text-sm font-bold transition ${
                    activo
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {estado.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Ver
            </span>
            <div className="flex gap-1">
              {perPageOptions.map((option) => (
                <Link
                  key={option}
                  href={crearHref(query, { perPage: option, page: 1 })}
                  className={`rounded px-2 py-1 text-sm font-black transition ${
                    query.perPage === option
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {option}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              <th className="px-5 py-4">Pedido</th>
              <th className="px-5 py-4">Comprador</th>
              <th className="px-5 py-4">Vendedor</th>
              <th className="px-5 py-4">Monto</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4 text-right">Accion</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((transaccion) => (
              <tr
                key={transaccion.pedido}
                className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0"
              >
                <td className="px-5 py-4 font-black text-slate-950">
                  {transaccion.pedido}
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-800">
                    {transaccion.comprador}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">Comprador</div>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-700">
                  {transaccion.vendedor}
                </td>
                <td className="px-5 py-4 font-black text-slate-950">
                  {transaccion.monto}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${estadoClases[transaccion.estado]}`}
                  >
                    {capitalizar(transaccion.estado)}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-500">
                  {transaccion.fecha}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-md px-3 py-1.5 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-blue-700 hover:ring-1 hover:ring-slate-200"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Pagina {query.page} de {totalPaginas}
        </p>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Paginacion">
          <Link
            href={crearHref(query, { page: Math.max(1, query.page - 1) })}
            aria-disabled={query.page === 1}
            className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
              query.page === 1
                ? "pointer-events-none border-slate-100 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Anterior
          </Link>
          {paginas.map((pagina) => (
            <Link
              key={pagina}
              href={crearHref(query, { page: pagina })}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-black transition ${
                pagina === query.page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pagina}
            </Link>
          ))}
          <Link
            href={crearHref(query, {
              page: Math.min(totalPaginas, query.page + 1),
            })}
            aria-disabled={query.page === totalPaginas}
            className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
              query.page === totalPaginas
                ? "pointer-events-none border-slate-100 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Siguiente
          </Link>
        </nav>
      </div>
    </article>
  );
}
