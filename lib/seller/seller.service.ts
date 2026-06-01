type VendedorResponse = {
  idVendedor: string;
};

export async function obtenerIdVendedor(idEvento: number, origen: string) {
  const sellerApiUrl = process.env.SELLER_API_URL ?? `${origen}/api`;
  const sellerApiKey = process.env.SELLER_API_KEY;

  if (!sellerApiKey) {
    throw new Error("SELLER_API_KEY no esta definida");
  }

  const response = await fetch(
    `${sellerApiUrl}/seller/eventos/vendedor/${idEvento}`,
    {
      method: "GET",
      headers: {
        "x-api-key": sellerApiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Seller respondio con estado ${response.status}`);
  }

  const data = (await response.json()) as Partial<VendedorResponse>;

  if (typeof data.idVendedor !== "string" || data.idVendedor.trim().length === 0) {
    throw new Error("Seller no devolvio un idVendedor valido");
  }

  return data.idVendedor;
}
