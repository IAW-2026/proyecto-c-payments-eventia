export const PORCENTAJE_COMISION_EVENTIA = 12;
export const TASA_COMISION_EVENTIA = PORCENTAJE_COMISION_EVENTIA / 100;

export function calcularComisionVenta(montoEvento: number) {
  const montoComision = Math.round(montoEvento * TASA_COMISION_EVENTIA);
  const montoTotalComprador = montoEvento + montoComision;

  return {
    montoEvento,
    montoBruto: montoTotalComprador,
    porcentajeComision: PORCENTAJE_COMISION_EVENTIA,
    montoComision,
    montoNetoVendedor: montoEvento,
    montoTotalComprador,
  };
}
