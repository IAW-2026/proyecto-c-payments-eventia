import PantallaCarga from "@/componentes/ui/PantallaCarga";

export default function Loading() {
  return (
    <PantallaCarga
      etiqueta="Eventia"
      titulo="Preparando tu acceso"
      descripcion="Estamos revisando tu rol para llevarte al panel correcto."
      variante="redirect"
    />
  );
}
