import Link from "next/link";
import BuscadorTransacciones from "./BuscadorTransacciones";
import { crearHrefAdmin } from "../_lib/admin-routes";
import type {
  EstadoFiltroAdmin,
  QueryAdmin,
  VendedorAdmin,
} from "../types";

type FiltrosTransaccionesProps = {
  query: QueryAdmin;
  vendedores: VendedorAdmin[];
};

const estados: { label: string; value: EstadoFiltroAdmin }[] = [
  { label: "Todas", value: "todas" },
  { label: "Aprobadas", value: "aprobada" },
  { label: "Pendientes", value: "pendiente" },
  { label: "Fallidas", value: "fallida" },
  { label: "Canceladas", value: "cancelada" },
];

const perPageOptions = [10, 25, 50];

export default function FiltrosTransacciones({
  query,
  vendedores,
}: FiltrosTransaccionesProps) {
  return (
    <>
      <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(220px,1fr)_minmax(220px,280px)]">
        <BuscadorTransacciones query={query} />

        <form action="/admin" className="flex gap-2">
          <input type="hidden" name="search" value={query.search} />
          <input
            type="hidden"
            name="estado"
            value={query.estado === "todas" ? "" : query.estado}
          />
          <input type="hidden" name="perPage" value={query.perPage} />
          <select
            name="vendedor"
            defaultValue={query.vendedor}
            className="h-11 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">Todos los vendedores</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor.id} value={vendedor.id}>
                {vendedor.nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-11 rounded-md bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
          >
            Filtrar
          </button>
        </form>
      </div>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {estados.map((estado) => {
            const activo = query.estado === estado.value;

            return (
              <Link
                key={estado.value}
                href={crearHrefAdmin(query, { estado: estado.value, page: 1 })}
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
                href={crearHrefAdmin(query, { perPage: option, page: 1 })}
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
    </>
  );
}
