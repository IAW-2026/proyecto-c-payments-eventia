"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { QueryAdmin } from "../types";

type BuscadorTransaccionesProps = {
  query: QueryAdmin;
};

export default function BuscadorTransacciones({
  query,
}: BuscadorTransaccionesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query.search);

  useEffect(() => {
    setSearch(query.search);
  }, [query.search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const valor = search.trim();

      if (valor) {
        params.set("search", valor);
      } else {
        params.delete("search");
      }

      params.delete("page");

      const qs = params.toString();
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;
      const currentUrl = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, search, searchParams]);

  return (
    <form action="/admin" className="relative">
      <input
        type="hidden"
        name="estado"
        value={query.estado === "todas" ? "" : query.estado}
      />
      <input type="hidden" name="vendedor" value={query.vendedor} />
      <input type="hidden" name="perPage" value={query.perPage} />
      <input
        name="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por comprador, vendedor o pedido..."
        className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </form>
  );
}
