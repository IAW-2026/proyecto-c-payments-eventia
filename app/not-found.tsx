import PantallaEstado from "@/componentes/ui/PantallaEstado";

export default function NotFound() {
  return (
    <PantallaEstado
      badge="Ruta no encontrada"
      codigo="404"
      titulo="No encontramos esta pagina"
      descripcion="La direccion puede estar incompleta, haber cambiado o no pertenecer a una seccion disponible de Eventia."
      accionPrimaria={{
        href: "/home",
        label: "Volver al inicio",
      }}
    />
  );
}
