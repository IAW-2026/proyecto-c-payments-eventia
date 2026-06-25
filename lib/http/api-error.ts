export type CuerpoErrorHttp = {
  error: string;
};

export class ErrorRespuestaHttp extends Error {
  constructor(
    public readonly status: number,
    public readonly body: CuerpoErrorHttp,
  ) {
    super(body.error);
  }
}

export function esErrorRespuestaHttp(
  error: unknown,
): error is ErrorRespuestaHttp {
  return error instanceof ErrorRespuestaHttp;
}

export function obtenerMensajeError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  if (error && typeof error === "object") {
    return JSON.stringify(error);
  }

  return "Error desconocido";
}
