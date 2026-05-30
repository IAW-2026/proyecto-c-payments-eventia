import Link from "next/link";
import { EstadoTransaccion } from "@prisma/client";
import { protegerRutaPorRol } from "@/lib/auth/guards";
import prisma from "@/lib/db/prisma";

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default async function CompradorPage() {
  const { user } = await protegerRutaPorRol(["buyer"]);

  const inicioPagosPendientes = performance.now();
  const pagosPendientes = await prisma.transaccion.findMany({
    where: {
      id_comprador: user.id,
      estado_transaccion: EstadoTransaccion.PENDIENTE,
    },
    orderBy: { creado_en: "desc" },
    take: 3,
    select: {
      id_transaccion: true,
      id_pedido: true,
      monto: true,
    },
  });

  console.log(
    "pagos pendientes comprador:",
    Math.round(performance.now() - inicioPagosPendientes),
    "ms",
  );

  return (
    <main className="layout-container">
      <section className="mx-auto max-w-4xl">
        <header className="mb-8">
          <span className="chip-retro">Comprador</span>
          <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
            Tus pagos
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            Revisa si tenes pagos pendientes y continua el checkout cuando lo
            necesites.
          </p>
        </header>

        <article className="card-retro-tonal">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-label-lg text-on-surface-variant">
                Pagos pendientes
              </p>
              <strong className="mt-3 block text-headline-md text-primary">
                {pagosPendientes.length}
              </strong>
              <p className="mt-3 text-body-md text-on-surface-variant">
                {pagosPendientes.length > 0
                  ? "Tenes compras esperando confirmacion de pago."
                  : "No tenes pagos pendientes por ahora."}
              </p>
            </div>

            <Link href="/comprador/checkout" className="btn-retro-primary">
              Ir al checkout
            </Link>
          </div>

          {pagosPendientes.length > 0 && (
            <div className="mt-6 grid gap-3">
              {pagosPendientes.map((pago) => (
                <div
                  key={pago.id_transaccion}
                  className="rounded-lg border border-primary/15 bg-surface-container-low p-4"
                >
                  <p className="text-label-lg text-on-surface-variant">
                    Pedido #{pago.id_pedido}
                  </p>
                  <p className="mt-1 text-body-md font-semibold text-on-surface">
                    {formatoMoneda.format(pago.monto)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
