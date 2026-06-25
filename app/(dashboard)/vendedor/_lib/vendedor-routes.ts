import type { QueryVendedor } from "../types";

type VendedorQueryChange = Partial<
  Record<"estado" | "page", string | number>
>;

export function crearHrefVendedor(
  query: QueryVendedor,
  cambios: VendedorQueryChange,
) {
  const params = new URLSearchParams();
  const next = { ...query, ...cambios };
  const page = Number(next.page);

  if (next.estado && next.estado !== "todas") {
    params.set("estado", String(next.estado));
  }
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `/vendedor?${qs}` : "/vendedor";
}
