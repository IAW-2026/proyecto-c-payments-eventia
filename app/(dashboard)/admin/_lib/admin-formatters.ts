import { EstadoTransaccion } from "@prisma/client";
import type { EstadoTransaccionAdmin } from "../types";
export { formatearFecha } from "@/lib/formatters/fecha";
export { formatearMonto } from "@/lib/formatters/moneda";

export function estadoPrismaDesdeAdmin(estado: EstadoTransaccionAdmin) {
  const estados: Record<EstadoTransaccionAdmin, EstadoTransaccion> = {
    aprobada: EstadoTransaccion.APROBADA,
    pendiente: EstadoTransaccion.PENDIENTE,
    fallida: EstadoTransaccion.FALLIDA,
    cancelada: EstadoTransaccion.CANCELADA,
  };

  return estados[estado];
}

export function estadoAdminDesdePrisma(
  estado: EstadoTransaccion,
): EstadoTransaccionAdmin {
  const estados: Record<EstadoTransaccion, EstadoTransaccionAdmin> = {
    APROBADA: "aprobada",
    PENDIENTE: "pendiente",
    FALLIDA: "fallida",
    CANCELADA: "cancelada",
  };

  return estados[estado];
}

