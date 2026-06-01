import Link from "next/link";

type AccionEstado = {
  href: string;
  label: string;
};

type PantallaEstadoProps = {
  badge: string;
  titulo: string;
  descripcion: string;
  codigo?: string;
  accionPrimaria?: AccionEstado;
  children?: React.ReactNode;
};

export default function PantallaEstado({
  badge,
  titulo,
  descripcion,
  codigo,
  accionPrimaria,
  children,
}: PantallaEstadoProps) {
  return (
    <main className="layout-container grid place-items-center">
      <section className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-44 w-full max-w-md items-end justify-start overflow-hidden rounded-xl border border-primary/10 bg-[radial-gradient(circle_at_20%_20%,rgba(254,158,162,0.55),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(101,0,3,0.16),transparent_24%),linear-gradient(135deg,#fff9ea,#eee8d9)] p-5 shadow-soft-ambient">
          <span className="rounded-full bg-background/90 px-3 py-1 font-label text-[11px] font-black uppercase tracking-wide text-primary">
            {badge}
          </span>
        </div>

        {codigo && (
          <p className="font-label text-sm font-black uppercase tracking-wide text-primary">
            {codigo}
          </p>
        )}

        <h1 className="mt-3 text-headline-lg-mobile text-on-background md:text-headline-lg">
          {titulo}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-body-md text-on-surface-variant">
          {descripcion}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {accionPrimaria && (
            <Link href={accionPrimaria.href} className="btn-retro-primary">
              {accionPrimaria.label}
            </Link>
          )}
          {children}
        </div>
      </section>
    </main>
  );
}
