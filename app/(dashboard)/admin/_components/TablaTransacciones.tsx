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

function abreviarId(value: string) {
  if (value.length <= 18) return value;

  return `${value.slice(0, 10)}...${value.slice(-4)}`;
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
            <th className="px-5 py-4">ID comprador</th>
            <th className="px-5 py-4">ID vendedor</th>
            <th className="px-5 py-4">Total comprador</th>
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
                No hay transacciones para los filtros seleccionados.
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
                <td className="px-5 py-4">
                  <div
                    className="font-semibold text-slate-800"
                    title={transaccion.idComprador}
                  >
                    {abreviarId(transaccion.idComprador)}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    ID comprador
                  </div>
                </td>
                <td
                  className="px-5 py-4 font-semibold text-slate-700"
                  title={transaccion.vendedor}
                >
                  {abreviarId(transaccion.vendedor)}
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
