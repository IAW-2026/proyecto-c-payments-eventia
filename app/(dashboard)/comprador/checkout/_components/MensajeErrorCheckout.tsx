type MensajeErrorCheckoutProps = {
  mensaje: string | null;
};

export default function MensajeErrorCheckout({
  mensaje,
}: MensajeErrorCheckoutProps) {
  if (!mensaje) return null;

  return (
    <div className="mb-6 rounded-xl border border-primary/20 bg-secondary-container/40 px-4 py-3 text-sm font-semibold text-primary">
      {mensaje}
    </div>
  );
}
