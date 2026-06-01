import { NextResponse } from "next/server";
import { validarApiKey } from "@/lib/auth/apiKey";
import { z } from "zod";

type Params = {
  idEvento: string;
};

const paramsSchema = z.object({
  idEvento: z.coerce.number().int().positive(),
});

function obtenerIdVendedorMock(idEvento: number) {
  return process.env.SELLER_DEMO_USER_ID ?? `user_vendedor_evento_${idEvento}`;
}

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

  const params = await context.params;
  const resultado = paramsSchema.safeParse(params);

  if (!resultado.success) {
    return NextResponse.json(
      { error: "idEvento invalido" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      idVendedor: obtenerIdVendedorMock(resultado.data.idEvento),
    },
    { status: 200 },
  );
}
