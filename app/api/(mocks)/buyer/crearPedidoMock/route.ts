import { NextResponse } from "next/server";

type CrearPedidoMockRequest = {
  idComprador: string;
  idEvento: number;
};

type PedidoMock = {
  idPedido: number;
  idEvento: number;
  monto: number;
  idComprador: string;
};

type EventoMock = {
  idEvento: number;
  precio: number;
};

const eventosMock: EventoMock[] = [
  {
    idEvento: 1,
    precio: 5000,
  },
  {
    idEvento: 2,
    precio: 8000,
  },
];

function esCrearPedidoMockValido(
  body: unknown,
): body is CrearPedidoMockRequest {
  if (!body || typeof body !== "object") return false;

  const datos = body as Partial<CrearPedidoMockRequest>;

  return (
    typeof datos.idComprador === "string" &&
    datos.idComprador.trim().length > 0 &&
    typeof datos.idEvento === "number" &&
    Number.isInteger(datos.idEvento) &&
    datos.idEvento > 0
  );
}

function obtenerEventoMock(idEvento: number) {
  return eventosMock.find((evento) => evento.idEvento === idEvento);
}

function generarPedidoMock({
  idComprador,
  evento,
}: {
  idComprador: string;
  evento: EventoMock;
}): PedidoMock {
  return {
    idPedido: Date.now() % 2_000_000_000,
    idEvento: evento.idEvento,
    monto: evento.precio,
    idComprador,
  };
}

function obtenerPaymentsApiUrl(origen: string) {
  if (process.env.PAYMENTS_API_URL) {
    return process.env.PAYMENTS_API_URL;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }

  return `${origen}/api`;
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
    const paymentsApiUrl = obtenerPaymentsApiUrl(origen);
    const evento = obtenerEventoMock(body.idEvento);

    if (!evento) {
      return NextResponse.json(
        { error: "Evento mock inexistente" },
        { status: 404 },
      );
    }

    const pedido = generarPedidoMock({
      idComprador: body.idComprador,
      evento,
    });

    const respuestaPayments = await fetch(
      `${paymentsApiUrl}/payments/nuevaTransaccion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": buyerApiKey,
        },
        body: JSON.stringify(pedido),
      },
    );

    const tipoContenido = respuestaPayments.headers.get("content-type");

    if (!tipoContenido?.includes("application/json")) {
      const respuestaTexto = await respuestaPayments.text();

      console.error("Payments no devolvio JSON", {
        url: `${paymentsApiUrl}/payments/nuevaTransaccion`,
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
    console.error("Error en mock de Buyer:", error);

    return NextResponse.json(
      { error: "No se pudo crear el pedido mock" },
      { status: 500 },
    );
  }
}
