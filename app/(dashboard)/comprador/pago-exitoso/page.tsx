import ResultadoPago from "../_components/ResultadoPago";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PagoExitosoPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <ResultadoPago
      tipo="exitoso"
      badge="Pago acreditado"
      titulo="Tu lugar ya esta reservado"
      descripcion="Recibimos la confirmacion del pago y tu reserva quedo asegurada."
      paymentId={params["payment_id"]}
      acciones={[
        {
          href: "/comprador",
          label: "Volver a mis pagos",
          variant: "primary",
        },
      ]}
    />
  );
}
