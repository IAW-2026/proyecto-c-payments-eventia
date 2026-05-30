import PantallaCarga from "@/componentes/ui/PantallaCarga";

export default function Loading() {
  return (
    <PantallaCarga
      etiqueta="Vendedor"
      titulo="Cargando panel"
      descripcion="Preparando ventas y pagos asociados a tu usuario."
    />
  );
}
