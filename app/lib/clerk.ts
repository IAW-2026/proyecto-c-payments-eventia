import { clerkClient } from "@clerk/nextjs/server";

export type RolUsuario = "admin" | "seller" | "buyer";

export async function obtenerUsuarioClerk(idUsuario: string) {
  try {
    const client = await clerkClient();
    return await client.users.getUser(idUsuario);
  } catch {
    return null;
  }
}

export function obtenerRolUsuario(metadata: unknown): RolUsuario | null {
  if (!metadata || typeof metadata !== "object") return null;

  const rol = (metadata as { rol?: unknown }).rol;

  if (rol === "admin" || rol === "seller" || rol === "buyer") {
    return rol;
  }

  return null;
}
