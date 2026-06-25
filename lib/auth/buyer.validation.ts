import { ErrorRespuestaHttp } from "@/lib/http/api-error";
import { obtenerRolesUsuario, obtenerUsuarioClerk } from "@/lib/auth/clerk";

export async function validarComprador(idComprador: string) {
  const comprador = await obtenerUsuarioClerk(idComprador);

  if (!comprador) {
    throw new ErrorRespuestaHttp(404, {
      error: "Comprador inexistente en Clerk",
    });
  }

  const rolesComprador = [
    ...obtenerRolesUsuario(comprador.publicMetadata),
    ...obtenerRolesUsuario(comprador.privateMetadata),
  ];

  if (!rolesComprador.includes("buyer")) {
    console.log(`Roles del comprador ${idComprador}: ${rolesComprador.join(", ")}`);
    throw new ErrorRespuestaHttp(403, {
      error: "El usuario de Clerk no tiene rol buyer",
    });
  }

  return comprador;
}
