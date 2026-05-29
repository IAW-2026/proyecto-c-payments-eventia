import { NextResponse } from "next/server";
import { validarApiKey } from "@/lib/auth/apiKey";

type Params = {
  idEvento: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<Params> },
) {
  if (!validarApiKey(request, process.env.SELLER_API_KEY)) {
    return NextResponse.json(
      { error: "API key invalida" },
      { status: 401 },
    );
  }

  const { idEvento } = await context.params;

  if (!idEvento || Number.isNaN(Number(idEvento))) {
    return NextResponse.json(
      { error: "idEvento invalido" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      idVendedor: `user_vendedor_evento_${idEvento}`,
    },
    { status: 200 },
  );
}
