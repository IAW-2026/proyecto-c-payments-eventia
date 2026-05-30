import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  obtenerRolDesdeClaims,
  obtenerRolDesdeUsuario,
  type RolUsuario,
} from "./roles";

export async function obtenerSesionConRol() {
  const sesion = await auth();
  const rolDesdeToken = obtenerRolDesdeClaims(sesion.sessionClaims);

  if (sesion.userId && rolDesdeToken) {
    return {
      user: { id: sesion.userId },
      rol: rolDesdeToken,
    };
  }

  const user = await currentUser();
  const rol = obtenerRolDesdeUsuario(user);

  return { user, rol };
}

export async function protegerRutaPorRol(rolesPermitidos: RolUsuario[]) {
  const sesion = await obtenerSesionConRol();

  if (!sesion.user) {
    redirect("/sign-in");
  }

  if (!sesion.rol || !rolesPermitidos.includes(sesion.rol)) {
    redirect("/home");
  }

  return sesion as typeof sesion & {
    user: NonNullable<typeof sesion.user>;
    rol: RolUsuario;
  };
}
