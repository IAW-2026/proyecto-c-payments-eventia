import type {
  EstadoFiltroVendedor,
  EstadoTransaccionVendedor,
  QueryVendedor,
} from "../types";

export type VendedorSearchParams = {
  estado?: string | string[];
  page?: string | string[];
};

const TRANSACCIONES_POR_PAGINA = 5;
const estadosTransaccion: EstadoTransaccionVendedor[] = [
  "aprobada",
  "pendiente",
  "fallida",
  "cancelada",
];

function primerValor(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizarNumero(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizarEstado(value?: string): EstadoFiltroVendedor {
  if (value && estadosTransaccion.includes(value as EstadoTransaccionVendedor)) {
    return value as EstadoTransaccionVendedor;
  }

  return "todas";
}

export function obtenerQueryVendedor(
  params: VendedorSearchParams,
): QueryVendedor {
  return {
    estado: normalizarEstado(primerValor(params.estado)),
    page: normalizarNumero(primerValor(params.page), 1),
    perPage: TRANSACCIONES_POR_PAGINA,
  };
}
