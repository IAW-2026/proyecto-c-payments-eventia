import { NextResponse } from "next/server";
import { z } from "zod";
import { obtenerBuyerApiKey, obtenerPaymentsApiUrl } from "../_lib/payments-api";

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

const crearPedidoMockSchema = z.object({
  idComprador: z.string().trim().min(1),
  idEvento: z.number().int().positive(),
});

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resultado = crearPedidoMockSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        { error: "Datos de comprador invalidos" },
        { status: 400 },
      );
    }

    const datos = resultado.data;

    const buyerApiKey = obtenerBuyerApiKey();

    const origen = new URL(request.url).origin;
    const paymentsApiUrl = obtenerPaymentsApiUrl(origen);
    const evento = obtenerEventoMock(datos.idEvento);

    if (!evento) {
      return NextResponse.json(
        { error: "Evento mock inexistente" },
        { status: 404 },
      );
    }

    const pedido = generarPedidoMock({
      idComprador: datos.idComprador,
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
