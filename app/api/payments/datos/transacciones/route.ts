import { NextResponse } from "next/server";
import { validarApiKey } from "@/lib/auth/apiKey";
import prisma from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const apiKeyValida = process.env.PAYMENTS_API_KEY
      ? validarApiKey(request, process.env.PAYMENTS_API_KEY)
      : false;

    if (!apiKeyValida) {
      return NextResponse.json({ error: "API key invalida" }, { status: 401 });
    }

    const transacciones = await prisma.Transaccion.findMany({
      orderBy: { creado_en: "desc" },
      select: {
        id_transaccion: true,
        id_pedido: true,
        monto: true,
        moneda: true,
        estado_transaccion: true,
      },
    });

    return NextResponse.json(transacciones, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo transacciones:", error);

    return NextResponse.json(
      { error: "Error al obtener transacciones" },
      { status: 500 },
    );
  }
}
