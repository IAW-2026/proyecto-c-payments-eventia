import { EstadoTransaccion } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { protegerRutaPorRol } from "@/lib/auth/guards";
import { formatearMonto } from "@/lib/formatters/moneda";

export default async function VendedorPage() {
  const { user } = await protegerRutaPorRol(["seller"]);

  const [ventasAprobadas, transaccionesPendientes, montoVendido] =
    await Promise.all([
      prisma.venta.count({
        where: {
          id_vendedor: user.id,
          transaccion: { estado_transaccion: EstadoTransaccion.APROBADA },
        },
      }),
      prisma.transaccion.count({
        where: {
          id_vendedor: user.id,
          estado_transaccion: EstadoTransaccion.PENDIENTE,
        },
      }),
      prisma.venta.aggregate({
        where: {
          id_vendedor: user.id,
          transaccion: { estado_transaccion: EstadoTransaccion.APROBADA },
        },
        _sum: { monto_neto_vendedor: true },
      }),
    ]);

  return (
    <main className="layout-container">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8">
          <span className="chip-retro">Vendedor</span>
          <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
            Panel de vendedor
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            Esta vista muestra solamente la actividad asociada a tu usuario.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="card-retro">
            <p className="text-label-lg text-on-surface-variant">
              Ventas aprobadas
            </p>
            <strong className="mt-4 block text-headline-md text-primary">
              {ventasAprobadas}
            </strong>
          </article>

          <article className="card-retro">
            <p className="text-label-lg text-on-surface-variant">
              Pagos pendientes
            </p>
            <strong className="mt-4 block text-headline-md text-primary">
              {transaccionesPendientes}
            </strong>
          </article>

          <article className="card-retro">
            <p className="text-label-lg text-on-surface-variant">
              Ganancia neta
            </p>
            <strong className="mt-4 block text-headline-md text-primary">
              {formatearMonto(Number(montoVendido._sum.monto_neto_vendedor ?? 0))}
            </strong>
          </article>
        </section>
      </section>
    </main>
  );
}
