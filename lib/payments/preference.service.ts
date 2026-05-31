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

function obtenerAppUrl(origen?: string) {
  return obtenerValorEnv("APP_URL") ?? origen;
}

function obtenerBackUrls(appUrl?: string) {
  return {
    success: obtenerValorEnv("NEXT_PUBLIC_BACK_URL_SUCCESS") ?? (
      appUrl ? `${appUrl}/comprador/pago-exitoso` : undefined
    ),
    failure: obtenerValorEnv("NEXT_PUBLIC_BACK_URL_FAILURE") ?? (
      appUrl ? `${appUrl}/comprador/pago-fallido` : undefined
    ),
    pending: obtenerValorEnv("NEXT_PUBLIC_BACK_URL_PENDING") ?? (
      appUrl ? `${appUrl}/comprador/pago-pendiente` : undefined
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
  const appUrl = obtenerAppUrl(origen);
  const notificationUrl = appUrl
    ? `${appUrl}/api/payments/webhooks/mercadopago`
    : undefined;
  const backUrls = obtenerBackUrls(appUrl);

  if (!backUrls.success) {
    throw new Error("No se pudo resolver la URL de retorno de Mercado Pago");
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
