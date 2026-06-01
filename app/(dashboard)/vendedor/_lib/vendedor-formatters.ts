import { EstadoTransaccion } from "@prisma/client";
import type { EstadoFiltroVendedor } from "../types";

export function estadoPrismaDesdeVendedor(
  estado: EstadoFiltroVendedor,
): EstadoTransaccion | undefined {
  if (estado === "todas") return undefined;

  return EstadoTransaccion[
    estado.toUpperCase() as keyof typeof EstadoTransaccion
  ];
}
