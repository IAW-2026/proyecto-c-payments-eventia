type OrganizadorResponse = {
  idOrganizador: string;
};

export async function obtenerIdOrganizador(idEvento: number, origen: string) {
  const sellerApiUrl = process.env.SELLER_API_URL ?? `${origen}/api`;
  const sellerApiKey = process.env.SELLER_API_KEY;

  if (!sellerApiKey) {
    throw new Error("SELLER_API_KEY no esta definida");
  }

  const response = await fetch(
    `${sellerApiUrl}/seller/eventos/${idEvento}/organizador`,
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

  const data = (await response.json()) as Partial<OrganizadorResponse>;

  if (typeof data.idOrganizador !== "string" || data.idOrganizador.trim().length === 0) {
    throw new Error("Seller no devolvio un idOrganizador valido");
  }

  return data.idOrganizador;
}
