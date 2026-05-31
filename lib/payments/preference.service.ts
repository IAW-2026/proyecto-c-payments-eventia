import preference from "@/lib/payments/mercadopago-client";

type DatosCrearPreferenciaPago = {
  idTransaccion?: number;
  idPedido: number;
  monto: number;
  origen?: string;
};

function obtenerValorEnv(nombre: string) {
  const valor = process.env[nombre]?.trim();
  return valor && valor.length > 0 ? valor : undefined;
}

function obtenerBackUrls(origen?: string) {
  return {
    success: obtenerValorEnv("NEXT_PUBLIC_BACK_URL_SUCCESS") ?? (
      origen ? `${origen}/comprador/pago-exitoso` : undefined
    ),
    failure: obtenerValorEnv("NEXT_PUBLIC_BACK_URL_FAILURE") ?? (
      origen ? `${origen}/comprador/pago-fallido` : undefined
    ),
    pending: obtenerValorEnv("NEXT_PUBLIC_BACK_URL_PENDING") ?? (
      origen ? `${origen}/comprador/pago-pendiente` : undefined
    ),
  };
}

export async function crearPreferenciaPago({
  idTransaccion,
  idPedido,
  monto,
  origen,
}: DatosCrearPreferenciaPago) {
  const fechaExpiracion = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const referenciaPago = idTransaccion ? String(idTransaccion) : undefined;
  const notificationUrl =`${origen}/api/payments/webhooks/mercadopago`;
  const backUrls = obtenerBackUrls(origen);

  console.log("Webhook de Mercado Pago configurado:", notificationUrl);
  console.log("Preferencia correspondiente a transaccion:", referenciaPago);


  if (!backUrls.success) {
    throw new Error("NEXT_PUBLIC_BACK_URL_SUCCESS no esta definida");
  }

  const res = await preference.create({
    body: {
      expires: true,
      expiration_date_to: fechaExpiracion,
      external_reference: referenciaPago,
      notification_url: notificationUrl,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [{ id: "ticket" }],
        installments: 1,
      },
      items: [
        {
          id: `pedido-${idPedido}`,
          title: `Pedido Eventia #${idPedido}`,
          quantity: 1,
          unit_price: monto,
          currency_id: "ARS",
        },
      ],
      back_urls: backUrls,
      auto_return: "approved",
    },
  });

  return { id: res.id };
}
