"use client";

import BotonPago from "./BotonDePago";

interface DesgloseProps {
  total: number;
  preferenceId: string | null;
  cargando: boolean;
  alIniciarCompra: () => void;
}

export default function DesgloseCompra({
  total,
  preferenceId,
  cargando,
  alIniciarCompra,
}: DesgloseProps) {
  return (
    <div className="card-retro flex h-fit w-full flex-col justify-between bg-surface-container-lowest">
      <div>
        <h3 className="mb-6 font-label text-lg font-black text-on-surface">
          Resumen de compra
        </h3>

        <div className="space-y-3 border-b border-primary/10 pb-5 text-sm">
          <div className="flex justify-between gap-4 font-medium text-on-surface-variant">
            <span>Subtotal</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs font-medium text-on-surface-variant">
            <span>Costo de procesamiento</span>
            <span className="rounded-full bg-secondary-container px-2 py-0.5 font-bold text-on-secondary-container">
              Gratis
            </span>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between gap-4 pt-5">
          <span className="font-bold tracking-tight text-on-surface">
            Total a pagar
          </span>
          <span className="text-2xl font-black tracking-tight text-primary">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {!preferenceId ? (
          <button
            type="button"
            onClick={alIniciarCompra}
            disabled={cargando}
            className="w-full rounded-xl bg-primary-container py-3.5 text-sm font-bold tracking-wide text-background shadow-soft-ambient transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-45"
          >
            {cargando ? "Procesando orden..." : "Continuar con Mercado Pago"}
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-primary/10 bg-surface-container-low p-4">
            <p className="text-center font-label text-[11px] font-black uppercase tracking-wide text-primary">
              Orden lista para abonar
            </p>
            <BotonPago preferenceId={preferenceId} />
          </div>
        )}

        <div className="space-y-2 border-t border-primary/10 pt-3 text-center text-[11px] font-medium leading-relaxed text-on-surface-variant">
          <p className="font-bold text-on-surface">Pago cifrado por Mercado Pago</p>
          <p>
            Vas a poder elegir saldo en cuenta, transferencia, tarjeta de
            debito o credito de manera directa y protegida.
          </p>
        </div>
      </div>
    </div>
  );
}

export type { DesgloseProps };
