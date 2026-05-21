import Image from "next/image";

interface ItemPedido {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface ResumenPedidoProps {
  titulo: string;
  fecha: string;
  lugar: string;
  imagen: string;
  items: ItemPedido[];
}

export default function ResumenPedido({ titulo, fecha, lugar, imagen, items }: ResumenPedidoProps) {
  return (
    // 7. Sombras muy suaves (shadow-xl/soft) y bordes redondeados orgánicos estilo Airbnb
    <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] w-full transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800 tracking-tight">Tu reserva</h3>
        {/* 9. Badge pastel de tu paleta */}
        <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Cupos confirmados 🏺
        </span>
      </div>

      {/* 3. FOTO EMOCIONAL DEL EVENTO */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 shadow-sm group">
        <img 
          src={imagen} 
          alt={titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] text-slate-800 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
          Artesanías
        </span>
      </div>

      {/* Título del Evento */}
      <div className="mb-6">
        <h4 className="font-extrabold text-xl text-slate-900 tracking-tight">{titulo}</h4>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Experiencia interactiva guiada de modelado manual</p>
      </div>

      {/* Logística en formato Agenda Limpia */}
      <div className="space-y-3.5 text-xs text-slate-600 mb-6 pb-6 border-b border-slate-100 font-medium">
        <div className="flex items-center gap-3">
          <span className="text-sm bg-slate-50 p-2 rounded-xl border border-slate-100">📅</span>
          <div>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider">Cuándo</p>
            <p className="text-slate-700 font-semibold">{fecha}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-slate-50 p-2 rounded-xl border border-slate-100">📍</span>
          <div>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider">Dónde</p>
            <p className="text-slate-700 font-semibold">{lugar}</p>
          </div>
        </div>
      </div>

      {/* Lista de Tickets */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <div>
              <p className="font-bold text-slate-800">{item.nombre}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {item.cantidad} entrada{item.cantidad > 1 ? 's' : ''}
              </p>
            </div>
            <span className="font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
              ${(item.cantidad * item.precio).toLocaleString("es-AR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}