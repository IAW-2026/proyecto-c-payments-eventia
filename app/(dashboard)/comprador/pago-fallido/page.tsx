import ResultadoPago from "../_components/ResultadoPago";

export default function PagoFallidoPage() {
  return (
    <ResultadoPago
      tipo="fallido"
      badge="Pago no procesado"
      titulo="No pudimos procesar tu pago"
      descripcion="Hubo un problema con la transaccion. No te preocupes, ningun cargo fue realizado en tu tarjeta."
      acciones={[
        {
          href: "/comprador",
          label: "Volver mis pagos",
          variant: "primary",
        },
        ]}
    />
  );
}
