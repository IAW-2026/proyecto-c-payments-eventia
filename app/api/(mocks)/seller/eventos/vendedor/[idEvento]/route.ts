import { NextResponse } from "next/server";

type Params = {
  idEvento: string;
};

export async function GET(
  _request: Request,
  context: { params: Promise<Params> },
) {
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
