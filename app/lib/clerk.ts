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

  const datos = metadata as {
    rol?: unknown;
    role?: unknown;
    roles?: unknown;
  };
  const rol = datos.rol ?? datos.role;

  if (rol === "admin" || rol === "seller" || rol === "buyer") {
    return rol;
  }

  if (Array.isArray(datos.roles)) {
    const rolEnLista = datos.roles.find(
      (item): item is RolUsuario =>
        item === "admin" || item === "seller" || item === "buyer",
    );

    return rolEnLista ?? null;
  }

  return null;
}
