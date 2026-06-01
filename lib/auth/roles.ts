export type RolUsuario = "adminPayments" | "seller" | "buyer";

type UsuarioConMetadata = {
  publicMetadata?: unknown;
  privateMetadata?: unknown;
  unsafeMetadata?: unknown;
} | null | undefined;

export function obtenerRolUsuario(metadata: unknown): RolUsuario | null {
  if (!metadata || typeof metadata !== "object") return null;

  const datos = metadata as {
    rol?: unknown;
    role?: unknown;
    roles?: unknown;
  };
  const rol = datos.rol ?? datos.role;

  if (rol === "adminPayments" || rol === "seller" || rol === "buyer") {
    return rol;
  }

  if (Array.isArray(datos.roles)) {
    const rolEnLista = datos.roles.find(
      (item): item is RolUsuario =>
        item === "adminPayments" || item === "seller" || item === "buyer",
    );

    return rolEnLista ?? null;
  }

  return null;
}

export function obtenerRolDesdeUsuario(
  usuario: UsuarioConMetadata,
): RolUsuario | null {
  return (
    obtenerRolUsuario(usuario?.publicMetadata) ??
    obtenerRolUsuario(usuario?.privateMetadata) ??
    obtenerRolUsuario(usuario?.unsafeMetadata)
  );
}

export function obtenerRolDesdeClaims(claims: unknown): RolUsuario | null {
  if (!claims || typeof claims !== "object") return null;

  const datos = claims as {
    metadata?: unknown;
    publicMetadata?: unknown;
    public_metadata?: unknown;
    privateMetadata?: unknown;
    unsafeMetadata?: unknown;
  };

  return (
    obtenerRolUsuario(datos.metadata) ??
    obtenerRolUsuario(datos.publicMetadata) ??
    obtenerRolUsuario(datos.public_metadata) ??
    obtenerRolUsuario(datos.privateMetadata) ??
    obtenerRolUsuario(datos.unsafeMetadata) ??
    obtenerRolUsuario(datos)
  );
}

export function obtenerRutaPorRol(rol: RolUsuario | null) {
  if (rol === "adminPayments") return "/admin";
  if (rol === "seller") return "/vendedor";
  if (rol === "buyer") return "/comprador";

  return "/home";
}
