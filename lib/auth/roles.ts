export type RolUsuario = "adminPayments" | "seller" | "buyer";

type UsuarioConMetadata = {
  publicMetadata?: unknown;
  privateMetadata?: unknown;
  unsafeMetadata?: unknown;
} | null | undefined;

const prioridadRoles: RolUsuario[] = ["adminPayments", "seller", "buyer"];

function esRolUsuario(value: unknown): value is RolUsuario {
  return (
    value === "adminPayments" ||
    value === "seller" ||
    value === "buyer"
  );
}

function combinarRoles(...grupos: RolUsuario[][]) {
  return prioridadRoles.filter((rol) =>
    grupos.some((grupo) => grupo.includes(rol)),
  );
}

export function obtenerRolesUsuario(metadata: unknown): RolUsuario[] {
  if (!metadata || typeof metadata !== "object") return [];

  const datos = metadata as {
    rol?: unknown;
    role?: unknown;
    roles?: unknown;
    rolesAdmin?: unknown;
  };
  const rol = datos.rol ?? datos.role;
  const roles: RolUsuario[] = [];

  if (
    Array.isArray(datos.rolesAdmin) &&
    datos.rolesAdmin.includes("adminPayments")
  ) {
    roles.push("adminPayments");
  }

  if (esRolUsuario(rol)) {
    roles.push(rol);
  }

  if (Array.isArray(datos.roles)) {
    roles.push(...datos.roles.filter(esRolUsuario));
  }

  return combinarRoles(roles);
}

export function obtenerRolUsuario(metadata: unknown): RolUsuario | null {
  return obtenerRolesUsuario(metadata)[0] ?? null;
}

export function obtenerRolesDesdeUsuario(
  usuario: UsuarioConMetadata,
): RolUsuario[] {
  return combinarRoles(
    obtenerRolesUsuario(usuario?.publicMetadata),
    obtenerRolesUsuario(usuario?.privateMetadata),
    obtenerRolesUsuario(usuario?.unsafeMetadata),
  );
}

export function obtenerRolDesdeUsuario(
  usuario: UsuarioConMetadata,
): RolUsuario | null {
  return obtenerRolesDesdeUsuario(usuario)[0] ?? null;
}

export function obtenerRolesDesdeClaims(claims: unknown): RolUsuario[] {
  if (!claims || typeof claims !== "object") return [];

  const datos = claims as {
    metadata?: unknown;
    publicMetadata?: unknown;
    public_metadata?: unknown;
    privateMetadata?: unknown;
    unsafeMetadata?: unknown;
  };

  return combinarRoles(
    obtenerRolesUsuario(datos.metadata),
    obtenerRolesUsuario(datos.publicMetadata),
    obtenerRolesUsuario(datos.public_metadata),
    obtenerRolesUsuario(datos.privateMetadata),
    obtenerRolesUsuario(datos.unsafeMetadata),
    obtenerRolesUsuario(datos),
  );
}

export function obtenerRolDesdeClaims(claims: unknown): RolUsuario | null {
  return obtenerRolesDesdeClaims(claims)[0] ?? null;
}

export function obtenerRutaPorRol(rol: RolUsuario | null) {
  if (rol === "adminPayments") return "/admin";
  if (rol === "seller") return "/vendedor";
  if (rol === "buyer") return "/comprador";

  return "/";
}
