import { NextResponse } from "next/server";
import { z } from "zod";
import { obtenerBuyerApiKey, obtenerPaymentsApiUrl } from "../_lib/payments-api";

const cancelarPedidoMockSchema = z.object({
  idPedido: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resultado = cancelarPedidoMockSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        { error: "Datos de pedido invalidos" },
        { status: 400 },
      );
    }

    const origen = new URL(request.url).origin;
    const paymentsApiUrl = obtenerPaymentsApiUrl(origen);
    const buyerApiKey = obtenerBuyerApiKey();

    const respuestaPayments = await fetch(
      `${paymentsApiUrl}/payments/pedidoCancelado`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": buyerApiKey,
        },
        body: JSON.stringify({
          idPedido: resultado.data.idPedido,
        }),
      },
    );

    if (respuestaPayments.status === 204) {
      return NextResponse.json(
        { mensaje: "Pedido cancelado" },
        { status: 200 },
      );
    }

    const tipoContenido = respuestaPayments.headers.get("content-type");

    if (!tipoContenido?.includes("application/json")) {
      const respuestaTexto = await respuestaPayments.text();

      console.error("Payments no devolvio JSON al cancelar pedido", {
        url: `${paymentsApiUrl}/payments/pedidoCancelado`,
        status: respuestaPayments.status,
        contentType: tipoContenido,
        bodyPreview: respuestaTexto.slice(0, 300),
      });

      return NextResponse.json(
        {
          error: "Payments no devolvio JSON",
          detalle: `Status ${respuestaPayments.status}. Content-Type: ${tipoContenido ?? "desconocido"}`,
        },
        { status: 502 },
      );
    }

    const data = await respuestaPayments.json();

    return NextResponse.json(data, { status: respuestaPayments.status });
  } catch (error) {
    console.error("Error cancelando pedido mock desde Buyer:", error);

    return NextResponse.json(
      { error: "No se pudo cancelar el pedido mock" },
      { status: 500 },
    );
  }
}
