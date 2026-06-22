import CheckoutClient from "./_components/CheckoutClient";
import ResumenPedido from "@/componentes/ui/ResumenPedido";
import MensajeErrorCheckout from "./_components/MensajeErrorCheckout";
import { protegerRutaPorRol } from "@/lib/auth/guards";
import { calcularComisionVenta } from "@/lib/payments/comisiones";
import prisma from "@/lib/db/prisma";

type CheckoutSearchParams = {
  idTransaccion?: string | string[];
};

type CheckoutCompradorPageProps = {
  searchParams: Promise<CheckoutSearchParams>;
};

function obtenerParametro(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutCompradorPage({
  searchParams,
}: CheckoutCompradorPageProps) {
  const { user } = await protegerRutaPorRol(["buyer"]);
  const params = await searchParams;
  const idTransaccion = Number(obtenerParametro(params.idTransaccion));

  const transaccion = Number.isInteger(idTransaccion)
    ? await prisma.transaccion.findFirst({
        where: {
          id_transaccion: idTransaccion,
          id_comprador: user.id,
        },
        select: {
          id_pedido: true,
          monto: true,
          id_preferencia_pago: true,
        },
      })
    : null;

  if (!transaccion?.id_preferencia_pago) {
    return (
      <main className="layout-container">
        <section className="mx-auto max-w-3xl">
          <MensajeErrorCheckout mensaje="No se encontro una orden de pago valida para iniciar el checkout." />
        </section>
      </main>
    );
  }

  const comision = calcularComisionVenta(transaccion.monto);

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
            idPedido={transaccion.id_pedido}
            monto={transaccion.monto}
          />

          <CheckoutClient
            preferenceId={transaccion.id_preferencia_pago}
            comision={comision.montoComision}
            total={transaccion.monto}
            totalConComision={comision.montoTotalComprador}
          />
        </div>
      </section>
    </main>
  );
}
