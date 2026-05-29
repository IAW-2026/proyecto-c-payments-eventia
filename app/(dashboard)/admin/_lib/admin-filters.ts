import type {
  EstadoFiltroAdmin,
  EstadoTransaccionAdmin,
  QueryAdmin,
} from "../types";

export type AdminSearchParams = {
  search?: string | string[];
  estado?: string | string[];
  vendedor?: string | string[];
  page?: string | string[];
  perPage?: string | string[];
};

const estadosTransaccion: EstadoTransaccionAdmin[] = [
  "aprobada",
  "pendiente",
  "fallida",
  "cancelada",
];

function primerValor(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizarEstado(value?: string): EstadoFiltroAdmin {
  if (value && estadosTransaccion.includes(value as EstadoTransaccionAdmin)) {
    return value as EstadoTransaccionAdmin;
  }

  return "todas";
}

function normalizarNumero(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function obtenerQueryAdmin(params: AdminSearchParams): QueryAdmin {
  return {
    search: primerValor(params.search) ?? "",
    estado: normalizarEstado(primerValor(params.estado)),
    vendedor: primerValor(params.vendedor) ?? "",
    page: normalizarNumero(primerValor(params.page), 1),
    perPage: normalizarNumero(primerValor(params.perPage), 10),
  };
}
