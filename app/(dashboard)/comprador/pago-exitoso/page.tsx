import prisma from "@/lib/db/prisma";
import ResultadoPago from "../_components/ResultadoPago";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function obtenerParametro(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function obtenerUrlShipping(
  referenciaPago: string | undefined,
): Promise<string> {
  const shippingAppUrl = process.env.SHIPPING_APP_URL?.trim().replace(/\/$/, "");

  if (!shippingAppUrl || !referenciaPago) {
    return "/comprador";
  }

  const transaccion = await prisma.transaccion.findUnique({
    where: { referencia_pago: referenciaPago },
    select: { id_pedido: true },
  });

  return transaccion
    ? `${shippingAppUrl}/buyer/${transaccion.id_pedido}`
    : "/comprador";
}

export default async function PagoExitosoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const referenciaPago = obtenerParametro(params["external_reference"]);
  const urlShipping = await obtenerUrlShipping(referenciaPago);

  return (
    <ResultadoPago
      tipo="exitoso"
      badge="Pago acreditado"
      titulo="Tu lugar ya esta reservado"
      descripcion="Recibimos la confirmacion del pago y tu reserva quedo asegurada."
      paymentId={params["payment_id"]}
      acciones={[
        {
          href: urlShipping,
          label: "Ver mis entradas",
          variant: "primary",
        },
      ]}
    />
  );
}
