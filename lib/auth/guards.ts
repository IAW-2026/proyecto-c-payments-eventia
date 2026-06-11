import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  obtenerRolesDesdeClaims,
  obtenerRolesDesdeUsuario,
  type RolUsuario,
} from "./roles";

export async function obtenerSesionConRol() {
  const sesion = await auth();
  const rolesDesdeToken = obtenerRolesDesdeClaims(sesion.sessionClaims);

  if (sesion.userId && rolesDesdeToken.length > 0) {
    return {
      user: { id: sesion.userId },
      rol: rolesDesdeToken[0],
      roles: rolesDesdeToken,
    };
  }

  const user = await currentUser();
  const roles = obtenerRolesDesdeUsuario(user);

  return { user, rol: roles[0] ?? null, roles };
}

export async function protegerRutaPorRol(rolesPermitidos: RolUsuario[]) {
  const sesion = await obtenerSesionConRol();

  if (!sesion.user) {
    redirect("/sign-in");
  }

  if (!sesion.roles.some((rol) => rolesPermitidos.includes(rol))) {
    redirect("/");
  }

  return sesion as typeof sesion & {
    user: NonNullable<typeof sesion.user>;
    rol: RolUsuario;
    roles: RolUsuario[];
  };
}
