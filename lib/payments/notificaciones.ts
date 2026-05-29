type EstadoTransaccionNotificacion = "PENDIENTE" | "APROBADA" | "FALLIDA" | "CANCELADA";

type PayloadEstadoTransaccion = {
  idPedido: number;
  estadoTransaccion: EstadoTransaccionNotificacion;
};

type DestinoNotificacion = "seller" | "shipping";

function obtenerUrlServicio(destino: DestinoNotificacion, origen: string) {
  let url: string;

  if (destino === "seller") {
    url = process.env.SELLER_API_URL ?? `${origen}/api`;
  } else {
    url = process.env.SHIPPING_API_URL ?? `${origen}/api`;
  }

  return url;
}

function obtenerApiKeyServicio(destino: DestinoNotificacion): string {
  let apiKey: string | undefined;
  if (destino === "seller") {
    apiKey = process.env.SELLER_API_KEY;
  } else {
    apiKey = process.env.SHIPPING_API_KEY;
  }
  if (!apiKey) {
    throw new Error(`API key de ${destino} no configurada`);
  }
  return apiKey;
}

export async function notificarEstadoTransaccion({
  origen,
  destinos,
  payload,
}: {
  origen: string;
  destinos: DestinoNotificacion[];
  payload: PayloadEstadoTransaccion;
}) {
  const resultados = await Promise.allSettled(
    destinos.map(async (destino) => {
      const urlServicio = obtenerUrlServicio(destino, origen);
      const apiKey = obtenerApiKeyServicio(destino);

      const response = await fetch(`${urlServicio}/${destino}/estadoTransaccion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`${destino} respondio con estado ${response.status}`);
      }

      return destino;
    }),
  );

  resultados.forEach((resultado, index) => {
    if (resultado.status === "rejected") {
      console.error(`No se pudo notificar a ${destinos[index]}:`, resultado.reason);
    }
  });
}
