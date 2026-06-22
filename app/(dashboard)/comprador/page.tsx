import Link from "next/link";
import { EstadoTransaccion } from "@prisma/client";
import { protegerRutaPorRol } from "@/lib/auth/guards";
import { formatearMonto } from "@/lib/formatters/moneda";
import { obtenerUltimasTransaccionesComprador } from "./_lib/comprador-data";

const etiquetasEstado: Record<EstadoTransaccion, string> = {
  APROBADA: "Aprobada",
  CANCELADA: "Cancelada",
  FALLIDA: "Fallida",
  PENDIENTE: "Pendiente",
};

const clasesEstado: Record<EstadoTransaccion, string> = {
  APROBADA: "bg-secondary-container text-on-secondary-container",
  CANCELADA: "bg-surface-container-high text-on-surface-variant",
  FALLIDA: "bg-primary-container text-background",
  PENDIENTE: "bg-surface-container-low text-primary ring-1 ring-primary/15",
};

export default async function CompradorPage() {
  const { user } = await protegerRutaPorRol(["buyer"]);

  const {
    transaccionPendiente,
    ultimasTransacciones,
  } = await obtenerUltimasTransaccionesComprador(user.id);

  return (
    <main className="layout-container">
      <section className="mx-auto max-w-4xl">
        <header className="mb-8">
          <span className="chip-retro">Comprador</span>
          <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
            Tus pagos
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            Consulta tus ultimas operaciones.
          </p>
        </header>

        {transaccionPendiente ? (
          <article className="card-retro-tonal mb-6 border-primary/25 bg-secondary-container/30">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-label-lg text-primary">
                  Pago pendiente
                </p>
                <h2 className="mt-2 text-title-lg text-on-surface">
                  Pedido #{transaccionPendiente.id_pedido}
                </h2>
                <p className="mt-2 text-body-md text-on-surface-variant">
                  Tenes una orden lista para abonar por{" "}
                  <strong className="text-on-surface">
                    {formatearMonto(transaccionPendiente.montoTotalComprador)}
                  </strong>
                  .
                </p>
              </div>

              <Link
                href={`/comprador/checkout?idTransaccion=${transaccionPendiente.id_transaccion}`}
                className="btn-retro-primary inline-flex w-full items-center justify-center whitespace-nowrap px-5 md:w-auto"
              >
                Continuar checkout
              </Link>
            </div>
          </article>
        ) : null}

        <article className="card-retro-tonal">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-label-lg text-on-surface-variant">
                Ultimas operaciones
              </p>
              <h2 className="mt-2 text-title-lg text-on-surface">
                Actividad reciente
              </h2>
            </div>
          </div>

          {ultimasTransacciones.length > 0 ? (
            <div className="mt-6 grid gap-3">
              {ultimasTransacciones.map((transaccion) => (
                <div
                  key={transaccion.id_transaccion}
                  className="flex flex-col gap-3 rounded-lg border border-primary/15 bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-label-lg text-on-surface-variant">
                      Pedido #{transaccion.id_pedido}
                    </p>
                    <p className="mt-1 text-body-md font-semibold text-on-surface">
                      {formatearMonto(transaccion.montoTotalComprador)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-label-sm font-semibold ${clasesEstado[transaccion.estado_transaccion]}`}
                    >
                      {etiquetasEstado[transaccion.estado_transaccion]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-lg border border-primary/15 bg-surface-container-low p-4 text-body-md text-on-surface-variant">
              Todavia no tenes operaciones registradas.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}
