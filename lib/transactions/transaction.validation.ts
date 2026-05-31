import { ErrorRespuestaHttp } from "@/lib/http/api-error";
import { z } from "zod";

const MAX_INT_POSTGRES = 2_147_483_647;

export const nuevaTransaccionSchema = z.object({
  idPedido: z.number().int().positive().max(MAX_INT_POSTGRES),
  idEvento: z.number().int().positive(),
  monto: z.number().positive(),
  idComprador: z.string().trim().min(1),
});

export type NuevaTransaccion = z.infer<typeof nuevaTransaccionSchema>;

export function validarBodyNuevaTransaccion(body: unknown): NuevaTransaccion {
  const resultado = nuevaTransaccionSchema.safeParse(body);

  if (!resultado.success) {
    throw new ErrorRespuestaHttp(400, {
      error: "Datos de transaccion invalidos",
    });
  }

  return resultado.data;
}
