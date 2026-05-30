type VariantePantallaCarga = "redirect" | "panel" | "checkout";

type PantallaCargaProps = {
  etiqueta?: string;
  titulo?: string;
  descripcion?: string;
  variante?: VariantePantallaCarga;
};

function LineaSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-container-high ${className}`}
    />
  );
}

function TarjetaSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-primary/15 bg-surface-container-low shadow-soft-ambient ${className}`}
    />
  );
}

function SkeletonPanel() {
  return (
    <>
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <TarjetaSkeleton key={item} className="h-40" />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-primary/15 bg-surface-container-lowest/70 p-5 shadow-soft-ambient">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <LineaSkeleton className="h-6 w-48" />
              <LineaSkeleton className="h-4 w-72 max-w-full" />
            </div>
            <LineaSkeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-3">
            {[1, 2, 3, 4].map((item) => (
              <LineaSkeleton key={item} className="h-14 w-full" />
            ))}
          </div>
        </div>

        <TarjetaSkeleton className="h-72" />
      </section>
    </>
  );
}

function SkeletonCheckout() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <TarjetaSkeleton className="h-80" />
      <TarjetaSkeleton className="h-80" />
    </section>
  );
}

export default function PantallaCarga({
  etiqueta = "Eventia",
  titulo = "Cargando",
  descripcion = "Preparando la informacion...",
  variante = "panel",
}: PantallaCargaProps) {
  const esRedirect = variante === "redirect";

  return (
    <main
      className={`layout-container ${esRedirect ? "grid place-items-center" : ""}`}
    >
      <section className={`mx-auto w-full ${esRedirect ? "max-w-md" : "max-w-7xl"}`}>
        <header className={`${esRedirect ? "text-center" : "mb-8"}`}>
          <span className="chip-retro">{etiqueta}</span>
          <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
            {titulo}
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            {descripcion}
          </p>
        </header>

        {esRedirect ? (
          <div className="mx-auto mt-8 h-2 w-40 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        ) : variante === "checkout" ? (
          <SkeletonCheckout />
        ) : (
          <SkeletonPanel />
        )}
      </section>
    </main>
  );
}
