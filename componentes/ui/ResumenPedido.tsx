interface ItemPedido {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface ResumenPedidoProps {
  titulo: string;
  fecha: string;
  lugar: string;
  imagen?: string;
  items: ItemPedido[];
}

export default function ResumenPedido({
  titulo,
  fecha,
  lugar,
  imagen,
  items,
}: ResumenPedidoProps) {
  return (
    <div className="card-retro-tonal w-full bg-surface-container-lowest/70">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="font-label text-lg font-black text-on-surface">
          Tu reserva
        </h3>
        <span className="rounded-full bg-secondary-container px-3 py-1 font-label text-[11px] font-black uppercase tracking-wide text-on-secondary-container">
          Cupos confirmados
        </span>
      </div>

      <div className="relative mb-6 h-44 overflow-hidden rounded-xl border border-primary/10 bg-surface-container">
        {imagen ? (
          <div
            role="img"
            aria-label={titulo}
            className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${imagen})` }}
          />
        ) : (
          <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_20%_20%,rgba(254,158,162,0.55),transparent_30%),linear-gradient(135deg,#fff9ea,#eee8d9)] p-5">
            <span className="rounded-full bg-background/90 px-3 py-1 font-label text-[11px] font-black uppercase tracking-wide text-primary">
              Evento destacado
            </span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-xl font-black tracking-tight text-on-surface">
          {titulo}
        </h4>
        <p className="mt-1 text-sm font-medium text-on-surface-variant">
          Experiencia interactiva guiada
        </p>
      </div>

      <div className="mb-6 space-y-3.5 border-b border-primary/10 pb-6 text-sm font-medium text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background font-label text-xs font-black text-primary">
            01
          </span>
          <div>
            <p className="font-label text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
              Cuando
            </p>
            <p className="font-semibold text-on-surface">{fecha}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background font-label text-xs font-black text-primary">
            02
          </span>
          <div>
            <p className="font-label text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
              Donde
            </p>
            <p className="font-semibold text-on-surface">{lugar}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.nombre}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div>
              <p className="font-bold text-on-surface">{item.nombre}</p>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {item.cantidad} entrada{item.cantidad > 1 ? "s" : ""}
              </p>
            </div>
            <span className="rounded-xl border border-primary/10 bg-background px-3 py-1 font-bold text-on-surface">
              ${(item.cantidad * item.precio).toLocaleString("es-AR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { ResumenPedidoProps };
