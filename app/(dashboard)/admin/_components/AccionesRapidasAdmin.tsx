"use client";

import { useActionState } from "react";
import {
  cancelarPedidoAdmin,
  type EstadoCancelarPedidoAdmin,
} from "../actions";

const estadoInicial: EstadoCancelarPedidoAdmin = {
  tipo: "idle",
  mensaje: "",
};

export default function AccionesRapidasAdmin() {
  const [estado, formAction, pendiente] = useActionState(
    cancelarPedidoAdmin,
    estadoInicial,
  );

  return (
    <article className="rounded-lg border border-primary/15 bg-surface-container-lowest/70 p-5 shadow-soft-ambient">
      <h2 className="text-headline-md text-on-background">Demo</h2>
      <p className="mt-2 text-body-md text-on-surface-variant">
        Sobre la cancelacion de pedidos.
      </p>

      <form action={formAction} className="mt-5 grid gap-3">
        <label
          htmlFor="idPedidoCancelar"
          className="text-xs font-black uppercase tracking-[0.16em] text-slate-500"
        >
          Simular pedido de cancelacion desde Buyer
        </label>
        <input
          id="idPedidoCancelar"
          name="idPedido"
          type="number"
          min="1"
          placeholder="Ej: 1982246842"
          className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          required
        />
        <button
          type="submit"
          className="btn-retro-secondary text-left disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pendiente}
        >
          {pendiente ? "Cancelando..." : "Cancelar pedido por API"}
        </button>

        {estado.mensaje ? (
          <p
            className={`text-sm font-bold ${
              estado.tipo === "exito" ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {estado.mensaje}
          </p>
        ) : null}
      </form>
    </article>
  );
}
