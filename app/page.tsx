import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="layout-container">
      <section className="grid-retro-fluid min-h-[calc(100vh-4rem)] items-center">
        <div className="col-span-4 md:col-span-6">
          <span className="chip-retro">Bienvenido a Eventia</span>

          <h1 className="mt-8 max-w-4xl text-headline-lg-mobile text-on-background md:text-display-lg">
            Descubri, crea y vivi los mejores eventos
          </h1>

          <p className="mt-6 max-w-2xl text-body-lg text-on-surface-variant">
            La plataforma para organizar eventos, vender entradas y gestionar
            pagos de manera simple, segura y confiable.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-in" className="btn-retro-primary text-center">
              Iniciar sesion
            </Link>
          </div>
        </div>

        <figure className="col-span-4 mt-10 md:col-span-6 md:mt-0">
          <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-primary/15 shadow-soft-ambient md:min-h-[calc(100vh-8rem)]">
            <Image
              src="/eventia-home.jpg"
              alt="Personas disfrutando un evento de Eventia"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </figure>
      </section>
    </main>
  );
}
