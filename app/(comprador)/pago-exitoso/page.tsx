import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PagoExitosoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const paymentId = params['payment_id']; // Captura el ID de pago de Mercado Pago

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        {/* Ícono de Check Verde */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">¡Pago Acreditado!</h1>
        <p className="text-slate-600 mb-6">Tu lugar en el evento ya está reservado de forma segura.</p>

        {paymentId && (
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 font-mono mb-6 border border-slate-200">
            ID de Operación: {paymentId}
          </div>
        )}

        <Link href="/" className="inline-block w-full bg-slate-900 text-white text-sm font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors text-center">
          Ir a mis eventos
        </Link>
      </div>
    </div>
  );
}