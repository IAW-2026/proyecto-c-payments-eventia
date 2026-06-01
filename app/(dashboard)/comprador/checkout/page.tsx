import CheckoutClient from "./_components/CheckoutClient";
import ResumenPedido from "@/componentes/ui/ResumenPedido";
import { protegerRutaPorRol } from "@/lib/auth/guards";
import { calcularComisionVenta } from "@/lib/payments/comisiones";

const datosEvento = {
  idEvento: 1,
  total: 5000,
};

export default async function CheckoutCompradorPage() {
  await protegerRutaPorRol(["buyer"]);
  const comision = calcularComisionVenta(datosEvento.total);

  return (
    <main className="layout-container">
      <section className="mx-auto max-w-5xl">
        <header className="mb-8">
          <span className="chip-retro">Checkout</span>
          <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
            Confirma tu pago
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            Revise el monto a pagar y complete el pago de forma
            segura.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <ResumenPedido
            idEvento={datosEvento.idEvento}
            monto={datosEvento.total}
          />

          <CheckoutClient
            idEvento={datosEvento.idEvento}
            comision={comision.montoComision}
            total={datosEvento.total}
            totalConComision={comision.montoTotalComprador}
          />
        </div>
      </section>
    </main>
  );
}
