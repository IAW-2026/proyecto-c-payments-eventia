export const PORCENTAJE_COMISION_EVENTIA = 12;
export const TASA_COMISION_EVENTIA = PORCENTAJE_COMISION_EVENTIA / 100;

export function calcularComisionVenta(montoBruto: number) {
  const montoComision = Math.round(montoBruto * TASA_COMISION_EVENTIA);

  return {
    montoBruto,
    porcentajeComision: PORCENTAJE_COMISION_EVENTIA,
    montoComision,
    montoNetoVendedor: montoBruto - montoComision,
  };
}
