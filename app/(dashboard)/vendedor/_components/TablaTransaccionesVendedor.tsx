import { EstadoTransaccion } from "@prisma/client";
import FiltrosTransaccionesVendedor from "./FiltrosTransaccionesVendedor";
import type { QueryVendedor, TransaccionVendedor } from "../types";

type TablaTransaccionesVendedorProps = {
  transacciones: TransaccionVendedor[];
  query: QueryVendedor;
  total: number;
};

const estadoClases: Record<EstadoTransaccion, string> = {
  APROBADA: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  PENDIENTE: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  FALLIDA: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  CANCELADA: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

const estadoEtiquetas: Record<EstadoTransaccion, string> = {
  APROBADA: "Aprobada",
  PENDIENTE: "Pendiente",
  FALLIDA: "Fallida",
  CANCELADA: "Cancelada",
};

function abreviarId(value: string) {
  if (value.length <= 18) return value;

  return `${value.slice(0, 10)}...${value.slice(-4)}`;
}

export default function TablaTransaccionesVendedor({
  transacciones,
  query,
  total,
}: TablaTransaccionesVendedorProps) {
  const desde = total === 0 ? 0 : (query.page - 1) * query.perPage + 1;
  const hasta = Math.min(query.page * query.perPage, total);

  return (
    <article className="rounded-lg border border-primary/15 bg-surface-container-lowest/70 shadow-soft-ambient">
      <div className="border-b border-primary/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-title-lg text-on-background">Transacciones</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Historial financiero asociado a tu usuario vendedor.
            </p>
          </div>
          <p className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
            Mostrando {desde}-{hasta} de {total}
          </p>
        </div>

        <FiltrosTransaccionesVendedor query={query} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              <th className="px-5 py-4">Pedido</th>
              <th className="px-5 py-4">ID comprador</th>
              <th className="px-5 py-4">Total cobrado</th>
              <th className="px-5 py-4">A acreditar</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm font-semibold text-slate-500"
                >
                  Todavia no hay transacciones asociadas a tu usuario.
                </td>
              </tr>
            ) : (
              transacciones.map((transaccion) => (
                <tr
                  key={transaccion.pedido}
                  className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0"
                >
                  <td className="px-5 py-4 font-black text-slate-950">
                    {transaccion.pedido}
                  </td>
                  <td
                    className="px-5 py-4 font-semibold text-slate-700"
                    title={transaccion.idComprador}
                  >
                    {abreviarId(transaccion.idComprador)}
                  </td>
                  <td className="px-5 py-4 font-black text-slate-950">
                    {transaccion.montoComprador}
                  </td>
                  <td className="px-5 py-4 font-black text-primary">
                    {transaccion.netoVendedor}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${estadoClases[transaccion.estado]}`}
                    >
                      {estadoEtiquetas[transaccion.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-500">
                    {transaccion.fecha}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
