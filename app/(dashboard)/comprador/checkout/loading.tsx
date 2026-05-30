import PantallaCarga from "@/componentes/ui/PantallaCarga";

export default function Loading() {
  return (
    <PantallaCarga
      etiqueta="Checkout"
      titulo="Preparando checkout"
      descripcion="Cargando el resumen de compra y el medio de pago."
      variante="checkout"
    />
  );
}
