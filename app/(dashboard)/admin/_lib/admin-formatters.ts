import { EstadoTransaccion } from "@prisma/client";
import type { EstadoTransaccionAdmin } from "../types";

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

export function formatearMonto(monto: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto);
}

export function formatearFecha(fecha: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}
