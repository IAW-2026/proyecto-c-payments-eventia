import preference from "@/integraciones/mercadopago";

type DatosCrearPreferenciaPago = {
  idTransaccion?: number;
  idPedido: number;
  monto: number;
};

export async function crearPreferenciaPago({
  idTransaccion,
  idPedido,
  monto,
}: DatosCrearPreferenciaPago) {
  const fechaExpiracion = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const referenciaPago = idTransaccion ? String(idTransaccion) : undefined;
  const notificationUrl = process.env.MP_WEBHOOK_URL ?? (process.env.TUNEL_NGROK
    ? `${process.env.TUNEL_NGROK}/api/payments/webhooks/mercadopago`
    : undefined);

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
      back_urls: {
        success: process.env.NEXT_PUBLIC_BACK_URL_SUCCESS,
        failure: process.env.NEXT_PUBLIC_BACK_URL_FAILURE,
        pending: process.env.NEXT_PUBLIC_BACK_URL_PENDING,
      },
      auto_return: "approved",
    },
  });

  return { id: res.id };
}
