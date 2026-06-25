const formatoMonedaArgentina = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearMonto(monto: number) {
  return formatoMonedaArgentina.format(monto);
}
