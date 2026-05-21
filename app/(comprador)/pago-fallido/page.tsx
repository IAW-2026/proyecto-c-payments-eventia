import Link from 'next/link';

export default function PagoFallidoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        {/* Ícono de Cruz Roja */}
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">No pudimos procesar tu pago</h1>
        <p className="text-slate-600 mb-6">Hubo un problema con la transacción. No te preocupes, ningún cargo fue realizado en tu tarjeta.</p>

        <div className="flex flex-col gap-2">
          <Link href="/" className="inline-block w-full bg-slate-900 text-white text-sm font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors text-center">
            Reintentar pago
          </Link>
          <Link href="/" className="inline-block w-full text-slate-500 text-xs font-medium py-2 hover:text-slate-800 transition-colors text-center">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}