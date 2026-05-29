'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializamos el SDK con la Public Key de tu archivo .env
const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
if (publicKey) {
  initMercadoPago(publicKey, { locale: 'es-AR' });
}

interface BotonPagoProps {
  preferenceId: string;
}

export default function BotonDePago({ preferenceId }: BotonPagoProps) {
  return (
    <div className="w-full max-w-[300px] mx-auto my-4">
      <Wallet 
        initialization={{ preferenceId: preferenceId }} 
      />
    </div>
  );
}

export type { BotonPagoProps };