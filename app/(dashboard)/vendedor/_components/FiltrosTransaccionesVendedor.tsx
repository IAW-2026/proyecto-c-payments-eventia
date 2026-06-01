import Link from "next/link";
import { crearHrefVendedor } from "../_lib/vendedor-routes";
import type { EstadoFiltroVendedor, QueryVendedor } from "../types";

type FiltrosTransaccionesVendedorProps = {
  query: QueryVendedor;
};

const estados: { label: string; value: EstadoFiltroVendedor }[] = [
  { label: "Todas", value: "todas" },
  { label: "Aprobadas", value: "aprobada" },
  { label: "Pendientes", value: "pendiente" },
  { label: "Fallidas", value: "fallida" },
  { label: "Canceladas", value: "cancelada" },
];

export default function FiltrosTransaccionesVendedor({
  query,
}: FiltrosTransaccionesVendedorProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {estados.map((estado) => {
        const activo = query.estado === estado.value;

        return (
          <Link
            key={estado.value}
            href={crearHrefVendedor(query, {
              estado: estado.value,
              page: 1,
            })}
            className={`inline-flex h-11 items-center rounded-md px-3 text-sm font-bold transition ${
              activo
                ? "bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {estado.label}
          </Link>
        );
      })}
    </div>
  );
}
