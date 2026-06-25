import ResultadoPago from "../_components/ResultadoPago";

function obtenerUrlEventosBuyer() {
  const buyerAppUrl = process.env.BUYER_APP_URL?.trim().replace(/\/$/, "");
  return buyerAppUrl ? `${buyerAppUrl}/eventos` : "/comprador";
}

export default function PagoFallidoPage() {
  return (
    <ResultadoPago
      tipo="fallido"
      badge="Pago no procesado"
      titulo="No pudimos procesar tu pago"
      descripcion="Hubo un problema con la transaccion. No te preocupes, ningun cargo fue realizado en tu tarjeta."
      acciones={[
        {
          href: obtenerUrlEventosBuyer(),
          label: "Volver a comprar",
          variant: "primary",
        },
      ]}
    />
  );
}
