import Link from "next/link";
import { crearHrefVendedor } from "../_lib/vendedor-routes";
import type { QueryVendedor } from "../types";

type PaginacionTransaccionesVendedorProps = {
  query: QueryVendedor;
  totalPaginas: number;
};

export default function PaginacionTransaccionesVendedor({
  query,
  totalPaginas,
}: PaginacionTransaccionesVendedorProps) {
  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-500">
        Pagina {query.page} de {totalPaginas}
      </p>
      <nav className="flex flex-wrap items-center gap-2" aria-label="Paginacion">
        <Link
          href={crearHrefVendedor(query, { page: query.page - 1 })}
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
            href={crearHrefVendedor(query, { page: pagina })}
            className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-black transition ${
              pagina === query.page
                ? "bg-primary text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {pagina}
          </Link>
        ))}
        <Link
          href={crearHrefVendedor(query, {
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
