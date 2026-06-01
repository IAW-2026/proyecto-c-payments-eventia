import { NextResponse } from "next/server";
import {
  esErrorRespuestaHttp,
  obtenerMensajeError,
} from "@/lib/http/api-error";
import { crearTransaccionCompleta } from "@/lib/transactions/transaction.service";

function manejarError(error: unknown) {
  if (esErrorRespuestaHttp(error)) {
    return NextResponse.json(error.body, { status: error.status });
  }

  console.error("Error creando nueva transaccion:", error);

  return NextResponse.json(
    {
      error: "No se pudo crear la transaccion",
      detalle:
        process.env.NODE_ENV === "development"
          ? obtenerMensajeError(error)
          : undefined,
    },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  try {
    const resultado = await crearTransaccionCompleta(request);

    return NextResponse.json(
      resultado,
      { status: 201 },
    );
  } catch (error) {
    return manejarError(error);
  }
}
