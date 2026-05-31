interface ResumenPedidoProps {
  idEvento: number;
  monto: number;
}

export default function ResumenPedido({
  idEvento,
  monto,
}: ResumenPedidoProps) {
  return (
    <div className="card-retro-tonal w-full bg-surface-container-lowest/70">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="font-label text-lg font-black text-on-surface">
          Orden de pago
        </h3>
        <span className="rounded-full bg-secondary-container px-3 py-1 font-label text-[11px] font-black uppercase tracking-wide text-on-secondary-container">
          Demo 
        </span>
      </div>

      <div className="relative mb-6 h-44 overflow-hidden rounded-xl border border-primary/10 bg-surface-container">
        <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_18%_22%,rgba(254,158,162,0.55),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(101,0,3,0.16),transparent_24%),linear-gradient(135deg,#fff9ea,#eee8d9)] p-5">
          <div>
            <span className="rounded-full bg-background/90 px-3 py-1 font-label text-[11px] font-black uppercase tracking-wide text-primary">
              Pago seguro
            </span>
            <p className="mt-3 max-w-xs text-sm font-semibold leading-5 text-on-surface">
              Orden lista para procesar con Mercado Pago.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-3.5 border-b border-primary/10 pb-6 text-sm font-medium text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background font-label text-xs font-black text-primary">
            01
          </span>
          <div>
            <p className="font-label text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
              Evento
            </p>
            <p className="font-semibold text-on-surface">#{idEvento}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background font-label text-xs font-black text-primary">
            02
          </span>
          <div>
            <p className="font-label text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
              Monto
            </p>
            <p className="font-semibold text-on-surface">
              ${monto.toLocaleString("es-AR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ResumenPedidoProps };
