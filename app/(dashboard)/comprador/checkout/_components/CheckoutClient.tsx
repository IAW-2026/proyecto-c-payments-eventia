"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import DesgloseCompra from "@/componentes/ui/DesgloseCompra";
import MensajeErrorCheckout from "./MensajeErrorCheckout";
import { crearPedidoDemo } from "../_lib/checkout-api";

type CheckoutClientProps = {
  idEvento: number;
  comision: number;
  total: number;
  totalConComision: number;
};

export default function CheckoutClient({
  idEvento,
  comision,
  total,
  totalConComision,
}: CheckoutClientProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  const procesarIntencionDePago = async () => {
    setCargando(true);
    setError(null);

    try {
      if (!isLoaded || !user?.id) {
        setError("No se pudo identificar al comprador.");
        return;
      }

      const preferenceId = await crearPedidoDemo({
        idComprador: user.id,
        idEvento,
      });

      setPreferenceId(preferenceId);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el pago. Intentalo nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <MensajeErrorCheckout mensaje={error} />

      <DesgloseCompra
        total={total}
        comision={comision}
        totalConComision={totalConComision}
        preferenceId={preferenceId}
        cargando={cargando}
        alIniciarCompra={procesarIntencionDePago}
      />
    </div>
  );
}
