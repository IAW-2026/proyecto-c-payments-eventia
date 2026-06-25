import { NextResponse } from "next/server";
import { esErrorRespuestaHttp } from "@/lib/http/api-error";
import { cancelarPedido } from "@/lib/transactions/cancelacion.service";

export async function POST(request: Request) {
  try {
    await cancelarPedido(request);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (esErrorRespuestaHttp(error)) {
      return NextResponse.json(error.body, { status: error.status });
    }

    console.error("Error procesando pedido cancelado:", error);

    return NextResponse.json(
      { error: "No se pudo procesar el pedido cancelado" },
      { status: 500 },
    );
  }
}
