import { NextResponse } from "next/server";
import { procesarWebhookMercadoPago } from "@/lib/payments/webhook.service";

export async function POST(request: Request) {
  try {
    const respuesta = await procesarWebhookMercadoPago(request);

    return new NextResponse(respuesta.mensaje, { status: respuesta.status });
  } catch (error) {
    console.error("Error procesando el webhook:", error);

    return new NextResponse("Error interno procesado", { status: 200 });
  }
}
