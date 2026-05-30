import PantallaCarga from "@/componentes/ui/PantallaCarga";

export default function Loading() {
  return (
    <PantallaCarga
      etiqueta="Administracion"
      titulo="Cargando panel"
      descripcion="Preparando metricas, filtros y transacciones recientes."
    />
  );
}
