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

    const ventas = await prisma.venta.findMany({
      orderBy: { fecha_venta: "desc" },
      select: {
        id_transaccion: true,
        monto_bruto: true,
        porcentaje_comision: true,
        monto_comision: true,
        monto_neto_vendedor: true,
        moneda: true,
      },
    });

    return NextResponse.json(ventas, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo ventas:", error);

    return NextResponse.json(
      { error: "Error al obtener ventas" },
      { status: 500 },
    );
  }
}
