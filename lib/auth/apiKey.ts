export function validarApiKey(
  request: Request,
  apiKeyEsperada?: string
): boolean {
  if (!apiKeyEsperada) {
    throw new Error("API key no configurada");
  }

  const apiKeyRecibida = request.headers.get("x-api-key");

  return apiKeyRecibida === apiKeyEsperada;
}
