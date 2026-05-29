import type { EstadoTransaccionAdmin, TransaccionAdmin } from "../types";

type TablaTransaccionesProps = {
  transacciones: TransaccionAdmin[];
};

const estadoClases: Record<EstadoTransaccionAdmin, string> = {
  aprobada: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pendiente: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  fallida: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  cancelada: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

function capitalizar(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function TablaTransacciones({
  transacciones,
}: TablaTransaccionesProps) {
  return (
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
          {transacciones.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-10 text-center text-sm font-semibold text-slate-500"
              >
                No hay transacciones para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            transacciones.map((transaccion) => (
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
                  <div className="mt-0.5 text-xs text-slate-400">
                    Comprador
                  </div>
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
