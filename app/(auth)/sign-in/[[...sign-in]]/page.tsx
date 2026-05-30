import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="layout-container">
      <section className="grid-retro-fluid min-h-[calc(100vh-12rem)] items-center">
        <div className="col-span-4 md:col-span-5">
          <span className="chip-retro">Acceso seguro</span>
          <h1 className="mt-6 text-headline-lg-mobile text-on-background md:text-headline-lg">
            Inicia sesion en Eventia
          </h1>
          <p className="mt-4 text-body-md text-on-surface-variant">
            Accede a tu panel para gestionar eventos, compras y pagos desde una
            experiencia simple y protegida.
          </p>
        </div>

        <div className="col-span-4 md:col-span-7">
          <div className="mx-auto w-full max-w-md rounded-xl border border-primary/15 bg-surface-container-lowest p-4 shadow-soft-ambient">
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl={undefined}
              fallbackRedirectUrl="/post-login"
              appearance={{
                elements: {
                  footerAction: { display: "none" },
                },
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
