import FiltrosTransacciones from "./FiltrosTransacciones";
import PaginacionTransacciones from "./PaginacionTransacciones";
import TablaTransacciones from "./TablaTransacciones";
import type { QueryAdmin, TransaccionAdmin, VendedorAdmin } from "../types";

type TransaccionesAdminProps = {
  transacciones: TransaccionAdmin[];
  vendedores: VendedorAdmin[];
  query: QueryAdmin;
  total: number;
};

export default function TransaccionesAdmin({
  transacciones,
  vendedores,
  query,
  total,
}: TransaccionesAdminProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / query.perPage));
  const desde = total === 0 ? 0 : (query.page - 1) * query.perPage + 1;
  const hasta = Math.min(query.page * query.perPage, total);

  return (
    <article className="overflow-hidden rounded-lg border border-primary/15 bg-surface-container-lowest/70 shadow-soft-ambient">
      <div className="border-b border-primary/10 px-5 py-5">
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

        <FiltrosTransacciones query={query} vendedores={vendedores} />
      </div>

      <TablaTransacciones transacciones={transacciones} />

      <PaginacionTransacciones query={query} totalPaginas={totalPaginas} />
    </article>
  );
}
