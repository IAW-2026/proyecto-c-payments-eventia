import PantallaCarga from "@/componentes/ui/PantallaCarga";

export default function Loading() {
  return (
    <PantallaCarga
      etiqueta="Comprador"
      titulo="Cargando tus pagos"
      descripcion="Buscando pagos pendientes asociados a tu cuenta."
    />
  );
}
