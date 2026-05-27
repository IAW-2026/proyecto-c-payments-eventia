import { NextResponse } from "next/server";

type CrearPedidoMockRequest = {
  idComprador: string;
};

type PedidoMock = {
  idPedido: number;
  idEvento: number;
  monto: number;
  idComprador: string;
};

function esCrearPedidoMockValido(
  body: unknown,
): body is CrearPedidoMockRequest {
  if (!body || typeof body !== "object") return false;

  const datos = body as Partial<CrearPedidoMockRequest>;

  return (
    typeof datos.idComprador === "string" &&
    datos.idComprador.trim().length > 0
  );
}

function generarPedidoMock(idComprador: string): PedidoMock {
  return {
    idPedido: Math.floor(10000 + Math.random() * 90000),
    idEvento: 145,
    monto: 78000,
    idComprador,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!esCrearPedidoMockValido(body)) {
      return NextResponse.json(
        { error: "Datos de comprador invalidos" },
        { status: 400 },
      );
    }

    const buyerApiKey = process.env.BUYER_API_KEY;

    if (!buyerApiKey) {
      throw new Error("BUYER_API_KEY no esta definida");
    }

    const origen = new URL(request.url).origin;
    const pedido = generarPedidoMock(body.idComprador);

    const respuestaPayments = await fetch(
      `${origen}/api/payments/nuevaTransaccion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": buyerApiKey,
        },
        body: JSON.stringify(pedido),
      },
    );

    const data = await respuestaPayments.json();

    return NextResponse.json(data, { status: respuestaPayments.status });
  } catch (error) {
    console.error("Error en mock de Buyer:", error);

    return NextResponse.json(
      { error: "No se pudo crear el pedido mock" },
      { status: 500 },
    );
  }
}
