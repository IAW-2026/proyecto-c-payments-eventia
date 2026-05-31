"use client";

import { useEffect } from "react";
import PantallaEstado from "@/componentes/ui/PantallaEstado";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PantallaEstado
      badge="Error inesperado"
      titulo="Algo no salio como esperabamos"
      descripcion="La operacion no pudo completarse. Podes intentar nuevamente o volver al inicio."
      accionPrimaria={{
        href: "/home",
        label: "Volver al inicio",
      }}
    >
      <button type="button" onClick={unstable_retry} className="btn-retro-secondary">
        Intentar de nuevo
      </button>
    </PantallaEstado>
  );
}
