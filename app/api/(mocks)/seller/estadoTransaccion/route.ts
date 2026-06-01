import { NextResponse } from "next/server";
import { validarApiKey } from "@/lib/auth/apiKey";
import { z } from "zod";

const estadoTransaccionSchema = z.object({
  idPedido: z.number().int().positive(),
  estadoTransaccion: z.enum(["PENDIENTE", "APROBADA", "FALLIDA", "CANCELADA"]),
});

export async function POST(request: Request) {
  try {
    if (!validarApiKey(request, process.env.SELLER_API_KEY)) {
      return NextResponse.json(
        { error: "API key de seller invalida" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const resultado = estadoTransaccionSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        { error: "Datos de estado invalidos" },
        { status: 400 },
      );
    }

    console.log("Seller mock recibio estado de transaccion:", resultado.data);

    return NextResponse.json(
      {
        recibido: true,
        servicio: "seller",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en mock de Seller:", error);

    return NextResponse.json(
      { error: "No se pudo procesar estado en seller" },
      { status: 500 },
    );
  }
}
