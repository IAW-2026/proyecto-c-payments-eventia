import PantallaEstado from "@/componentes/ui/PantallaEstado";
import { env } from "process";

export default function NotFound() {
  return (
    <PantallaEstado
      badge="Ruta no encontrada"
      codigo="404"
      titulo="No encontramos esta pagina"
      descripcion="La direccion puede estar incompleta, haber cambiado o no pertenecer a una seccion disponible de Eventia."
      accionPrimaria={{
        href: `${env.BUYER_APP_URL}/app/eventos?page=1`,
        label: "Volver al inicio",
      }}
    />
  );
}
