"use client";

import BotonPago from "./BotonDePago";

interface DesgloseProps {
  total: number;
  comision: number;
  totalConComision: number;
  preferenceId: string;
}

export default function DesgloseCompra({
  total,
  comision,
  totalConComision,
  preferenceId,
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
            <span>Comision Eventia</span>
            <span>${comision.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs font-medium text-on-surface-variant">
            <span>Procesamiento Mercado Pago</span>
            <span>Incluido</span>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between gap-4 pt-5">
          <span className="font-bold tracking-tight text-on-surface">
            Total a pagar
          </span>
          <span className="text-2xl font-black tracking-tight text-primary">
            ${totalConComision.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3 rounded-xl border border-primary/10 bg-surface-container-low p-4">
          <p className="text-center font-label text-[11px] font-black uppercase tracking-wide text-primary">
            Orden lista para abonar
          </p>
          <BotonPago preferenceId={preferenceId} />
        </div>

        <div className="space-y-2 border-t border-primary/10 pt-3 text-center text-[11px] font-medium leading-relaxed text-on-surface-variant">
          <p className="font-bold text-on-surface">Pago cifrado por Mercado Pago</p>
          <p>
            Vas a poder elegir pagar con tu saldo en cuenta, tarjeta de
            debito o credito.
          </p>
        </div>
      </div>
    </div>
  );
}

export type { DesgloseProps };
