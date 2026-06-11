import type { QueryAdmin } from "../types";

type AdminQueryChange = Partial<
  Record<"search" | "estado" | "vendedor" | "page" | "perPage", string | number>
>;

export function crearHrefAdmin(query: QueryAdmin, cambios: AdminQueryChange) {
  const params = new URLSearchParams();
  const next = { ...query, ...cambios };

  if (next.search) params.set("search", String(next.search));
  if (next.estado && next.estado !== "todas") {
    params.set("estado", String(next.estado));
  }
  if (next.vendedor) params.set("vendedor", String(next.vendedor));
  if (Number(next.page) > 1) params.set("page", String(next.page));
  if (Number(next.perPage) !== 10) {
    params.set("perPage", String(next.perPage));
  }

  const qs = params.toString();
  return qs ? `/admin?${qs}` : "/admin";
}
