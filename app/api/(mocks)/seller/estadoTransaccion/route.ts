import { NextResponse } from "next/server";
import { validarApiKey } from "@/app/lib/apiKey";

export async function POST(request: Request) {
  try {
    if (!validarApiKey(request, process.env.SELLER_API_KEY)) {
      return NextResponse.json(
        { error: "API key de seller invalida" },
        { status: 401 },
      );
    }

    const body = await request.json();

    console.log("Seller mock recibio estado de transaccion:", body);

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
