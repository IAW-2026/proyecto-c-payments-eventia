import ResultadoPago from "../_components/ResultadoPago";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PagoPendientePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <ResultadoPago
      tipo="pendiente"
      badge="Pago pendiente"
      titulo="Estamos esperando la confirmacion"
      descripcion="Tu pago quedo en revision o pendiente de acreditacion. Te vamos a mostrar el resultado cuando Mercado Pago lo confirme."
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
