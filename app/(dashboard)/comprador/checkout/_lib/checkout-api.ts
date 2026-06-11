type CrearPedidoDemoParams = {
  idComprador: string;
  idEvento: number;
};

type CrearPedidoResponse = {
  preferenceId?: string;
  error?: string;
  detalle?: string;
};

function obtenerMensajeErrorPreferencia(data: CrearPedidoResponse) {
  if (data.detalle) {
    return `${data.error}: ${data.detalle}`;
  }

  return data.error ?? "Error al obtener la preferencia.";
}

export async function crearPedidoDemo({
  idComprador,
  idEvento,
}: CrearPedidoDemoParams) {
  const respuesta = await fetch("/api/buyer/crearPedidoMock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idComprador,
      idEvento,
    }),
  });

  const tipoContenido = respuesta.headers.get("content-type");

  if (!tipoContenido?.includes("application/json")) {
    throw new Error("El servidor no devolvio una respuesta valida.");
  }

  const data = (await respuesta.json()) as CrearPedidoResponse;

  if (!respuesta.ok || !data.preferenceId) {
    throw new Error(obtenerMensajeErrorPreferencia(data));
  }

  return data.preferenceId;
}
