import BotonPago from "./BotonDePago";  

interface DesgloseProps {
  total: number;
  preferenceId: string | null;
  cargando: boolean;
  alIniciarCompra: () => void;
}

export default function DesgloseCompra({ total, preferenceId, cargando, alIniciarCompra }: DesgloseProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm w-full flex flex-col justify-between h-fit">
      <div>
        <h3 className="font-bold text-lg text-slate-800 tracking-tight mb-6">Resumen de compra</h3>
        
        {/* Desglose de precios */}
        <div className="space-y-3 text-sm pb-5 border-b border-slate-100">
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Subtotal</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-xs font-medium">
            <span>Costo de procesamiento</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
              Gratis
            </span>
          </div>
        </div>

        {/* Total Neto */}
        <div className="flex justify-between items-center pt-5 mb-8">
          <span className="font-bold text-slate-800 text-base tracking-tight">Total a pagar</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Acciones de Pago */}
      <div className="space-y-4">
        {!preferenceId ? (
          <button
            onClick={alIniciarCompra}
            disabled={cargando}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-40 text-sm tracking-wide shadow-sm"
          >
            {cargando ? "Procesando orden..." : "Continuar con Mercado Pago"}
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100/80">
            <p className="text-[11px] text-center text-emerald-600 font-bold tracking-wide uppercase">
              ✨ ¡Orden lista para abonar!
            </p>
            <BotonPago preferenceId={preferenceId} />
          </div>
        )}

        {/* Sellos de confianza */}
        <div className="pt-3 border-t border-slate-50 text-[11px] text-slate-400 font-medium space-y-2 text-center leading-relaxed">
          <p className="flex items-center justify-center gap-1.5 text-slate-500 font-semibold">
            🔒 Pago 100% cifrado por Mercado Pago
          </p>
          <p className="px-2">
            Podrás elegir pagar con saldo en cuenta, dinero disponible, transferencia, tarjeta de débito o crédito de manera totalmente directa y protegida.
          </p>
        </div>
      </div>
    </div>
  );
} 

export type { DesgloseProps };