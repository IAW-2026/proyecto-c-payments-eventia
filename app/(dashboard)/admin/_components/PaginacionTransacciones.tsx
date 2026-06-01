import Link from "next/link";
import { crearHrefAdmin } from "../_lib/admin-routes";
import type { QueryAdmin } from "../types";

type PaginacionTransaccionesProps = {
  query: QueryAdmin;
  totalPaginas: number;
};

export default function PaginacionTransacciones({
  query,
  totalPaginas,
}: PaginacionTransaccionesProps) {
  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-500">
        Pagina {query.page} de {totalPaginas}
      </p>
      <nav className="flex flex-wrap items-center gap-2" aria-label="Paginacion">
        <Link
          href={crearHrefAdmin(query, { page: Math.max(1, query.page - 1) })}
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
            href={crearHrefAdmin(query, { page: pagina })}
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
          href={crearHrefAdmin(query, {
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
  );
}
