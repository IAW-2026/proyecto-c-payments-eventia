import { clerkClient } from "@clerk/nextjs/server";
import {
  obtenerRolesUsuario,
  obtenerRolUsuario,
  type RolUsuario,
} from "./roles";

export type { RolUsuario };
export { obtenerRolesUsuario, obtenerRolUsuario };

export async function obtenerUsuarioClerk(idUsuario: string) {
  try {
    const client = await clerkClient();
    return await client.users.getUser(idUsuario);
  } catch {
    return null;
  }
}
