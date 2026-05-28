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

type EventoMock = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  stock: number;
  precio: number;
};

const eventosMock: EventoMock[] = [
  {
    idEvento: 1,
    nombre: "Taller de Ceramica",
    descripcion: "Clase introductoria de ceramica",
    fecha: "2025-10-10",
    ubicacion: "Rosario",
    stock: 20,
    precio: 5000,
  },
  {
    idEvento: 2,
    nombre: "Cata de vinos",
    descripcion: "Degustacion guiada",
    fecha: "2025-11-02",
    ubicacion: "Buenos Aires",
    stock: 15,
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
    datos.idComprador.trim().length > 0
  );
}

function obtenerEventoMock() {
  const indiceEvento = Math.floor(Math.random() * eventosMock.length);
  return eventosMock[indiceEvento];
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
    const evento = obtenerEventoMock();

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
