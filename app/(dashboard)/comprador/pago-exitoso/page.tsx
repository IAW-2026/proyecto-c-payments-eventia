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
  idPreferencia: string | undefined,
): Promise<string> {
  const shippingAppUrl = process.env.SHIPPING_APP_URL?.trim().replace(/\/$/, "");

  if (!shippingAppUrl) {
    console.warn("SHIPPING_APP_URL no esta configurada en este deployment");
    return "/comprador";
  }

  if (!referenciaPago && !idPreferencia) {
    console.warn(
      "Mercado Pago no envio external_reference ni preference_id en el retorno exitoso",
    );
    return "/comprador";
  }

  const transaccion = await prisma.transaccion.findFirst({
    where: {
      OR: [
        ...(referenciaPago ? [{ referencia_pago: referenciaPago }] : []),
        ...(idPreferencia
          ? [{ id_preferencia_pago: idPreferencia }]
          : []),
      ],
    },
    select: { id_pedido: true },
  });

  if (!transaccion) {
    console.warn("No se encontro la transaccion para redirigir a Shipping", {
      referenciaPago,
      idPreferencia,
    });
    return "/comprador";
  }

  return `${shippingAppUrl}/buyer/${transaccion.id_pedido}`;
}

export default async function PagoExitosoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const referenciaPago = obtenerParametro(params["external_reference"]);
  const idPreferencia = obtenerParametro(params["preference_id"]);
  const urlShipping = await obtenerUrlShipping(
    referenciaPago,
    idPreferencia,
  );

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
