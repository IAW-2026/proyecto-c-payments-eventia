import { ErrorRespuestaHttp } from "@/lib/http/api-error";
import { obtenerRolUsuario, obtenerUsuarioClerk } from "@/lib/auth/clerk";

export async function validarComprador(idComprador: string) {
  const comprador = await obtenerUsuarioClerk(idComprador);

  if (!comprador) {
    throw new ErrorRespuestaHttp(404, {
      error: "Comprador inexistente en Clerk",
    });
  }

  const rolComprador =
    obtenerRolUsuario(comprador.publicMetadata) ??
    obtenerRolUsuario(comprador.privateMetadata);

  if (rolComprador !== "buyer") {
    throw new ErrorRespuestaHttp(403, {
      error: "El usuario de Clerk no tiene rol buyer",
    });
  }

  return comprador;
}
