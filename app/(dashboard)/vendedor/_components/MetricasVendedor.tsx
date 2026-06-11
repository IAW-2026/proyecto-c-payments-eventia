import type { MetricaVendedor } from "../types";

type MetricasVendedorProps = {
  metricas: MetricaVendedor[];
};

export default function MetricasVendedor({
  metricas,
}: MetricasVendedorProps) {
  return (
    <section className="mb-6 grid gap-4 md:grid-cols-3">
      {metricas.map((metrica) => (
        <article key={metrica.titulo} className="card-retro">
          <p className="text-label-lg text-on-surface-variant">
            {metrica.titulo}
          </p>
          <strong className="mt-4 block text-headline-md text-primary">
            {metrica.valor}
          </strong>
          <span className="mt-3 block text-body-md text-on-surface-variant">
            {metrica.detalle}
          </span>
        </article>
      ))}
    </section>
  );
}
