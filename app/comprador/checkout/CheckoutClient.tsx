"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import DesgloseCompra from "@/app/ui/DesgloseCompra";

type CheckoutClientProps = {
  total: number;
};

type CrearPedidoResponse = {
  preferenceId?: string;
  error?: string;
  detalle?: string;
};

export default function CheckoutClient({ total }: CheckoutClientProps) {
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

      const respuesta = await fetch("/api/buyer/crearPedidoMock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idComprador: user.id,
        }),
      });

      const tipoContenido = respuesta.headers.get("content-type");

      if (!tipoContenido?.includes("application/json")) {
        setError("El servidor no devolvio una respuesta valida.");
        return;
      }

      const data = (await respuesta.json()) as CrearPedidoResponse;

      if (respuesta.ok && data.preferenceId) {
        setPreferenceId(data.preferenceId);
        return;
      }

      setError(
        data.detalle
          ? `${data.error}: ${data.detalle}`
          : data.error ?? "Error al obtener la preferencia.",
      );
    } catch (error) {
      console.error(error);
      setError("No se pudo iniciar el pago. Intentalo nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-secondary-container/40 px-4 py-3 text-sm font-semibold text-primary">
          {error}
        </div>
      )}

      <DesgloseCompra
        total={total}
        preferenceId={preferenceId}
        cargando={cargando}
        alIniciarCompra={procesarIntencionDePago}
      />
    </div>
  );
}
