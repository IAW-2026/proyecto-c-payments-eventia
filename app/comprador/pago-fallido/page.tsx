import ResultadoPago from "../ResultadoPago";

export default function PagoFallidoPage() {
  return (
    <ResultadoPago
      tipo="fallido"
      badge="Pago no procesado"
      titulo="No pudimos procesar tu pago"
      descripcion="Hubo un problema con la transaccion. No te preocupes, ningun cargo fue realizado en tu tarjeta."
      acciones={[
        {
          href: "/comprador/checkout",
          label: "Reintentar pago",
          variant: "primary",
        },
        {
          href: "/home",
          label: "Volver al inicio",
          variant: "secondary",
        },
      ]}
    />
  );
}
