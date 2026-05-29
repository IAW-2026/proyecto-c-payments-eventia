import Link from "next/link";

type ResultadoPagoTipo = "exitoso" | "fallido" | "pendiente";

type ResultadoPagoAccion = {
  href: string;
  label: string;
  variant: "primary" | "secondary";
};

type ResultadoPagoProps = {
  tipo: ResultadoPagoTipo;
  badge: string;
  titulo: string;
  descripcion: string;
  paymentId?: string | string[];
  acciones: ResultadoPagoAccion[];
};

const iconos: Record<ResultadoPagoTipo, string[]> = {
  exitoso: ["M5 13l4 4L19 7"],
  fallido: ["M6 18L18 6M6 6l12 12"],
  pendiente: ["M12 6v6l4 2", "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],
};

const iconoClases: Record<ResultadoPagoTipo, string> = {
  exitoso: "bg-secondary-container text-on-secondary-container",
  fallido: "bg-primary-container text-background",
  pendiente: "border border-primary/15 bg-surface-container-low text-primary",
};

function obtenerPaymentId(paymentId?: string | string[]) {
  return Array.isArray(paymentId) ? paymentId[0] : paymentId;
}

export default function ResultadoPago({
  tipo,
  badge,
  titulo,
  descripcion,
  paymentId,
  acciones,
}: ResultadoPagoProps) {
  const idOperacion = obtenerPaymentId(paymentId);

  return (
    <main className="layout-container">
      <section className="grid-retro-fluid min-h-[calc(100vh-12rem)] items-center">
        <div className="col-span-4 md:col-span-6 md:col-start-4">
          <article className="card-retro-tonal mx-auto max-w-3xl bg-surface-container/70 px-6 py-10 text-center md:px-10 md:py-12">
            <div
              className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${iconoClases[tipo]}`}
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {iconos[tipo].map((path) => (
                  <path
                    key={path}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={path}
                  />
                ))}
              </svg>
            </div>

            <span className="chip-retro">{badge}</span>
            <h1 className="mx-auto mt-5 max-w-2xl text-headline-lg-mobile text-on-background md:text-headline-md">
              {titulo}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-body-md text-on-surface-variant">
              {descripcion}
            </p>

            {idOperacion && (
              <div className="mx-auto mt-6 max-w-xl rounded-xl border border-primary/15 bg-surface-container-low px-4 py-3 font-mono text-label-sm text-on-surface-variant">
                ID de operacion: {idOperacion}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {acciones.map((accion) => (
                <Link
                  key={`${accion.href}-${accion.label}`}
                  href={accion.href}
                  className={
                    accion.variant === "primary"
                      ? "btn-retro-primary text-center"
                      : "btn-retro-secondary text-center"
                  }
                >
                  {accion.label}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
