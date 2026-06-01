export function obtenerPaymentsApiUrl(origen: string) {
  if (process.env.PAYMENTS_API_URL) {
    return process.env.PAYMENTS_API_URL;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }

  return `${origen}/api`;
}

export function obtenerBuyerApiKey() {
  const buyerApiKey = process.env.BUYER_API_KEY;

  if (!buyerApiKey) {
    throw new Error("BUYER_API_KEY no esta definida");
  }

  return buyerApiKey;
}
