import CheckoutClient from "./_components/CheckoutClient";
import ResumenPedido from "@/componentes/ui/ResumenPedido";

const datosEvento = {
  titulo: "Taller de Ceramica",
  fecha: "Sabado, 24 de mayo - 16:00 a 19:00",
  lugar: "Barrio Italia, Santiago",
  items: [{ nombre: "Entrada general", cantidad: 1, precio: 5000 }],
  total: 5000,
};

export default function CheckoutCompradorPage() {
  return (
    <main className="layout-container">
      <section className="mx-auto max-w-5xl">
        <header className="mb-8">
          <span className="chip-retro">Checkout</span>
          <h1 className="mt-5 text-headline-lg-mobile text-on-background md:text-headline-lg">
            Confirma tu compra
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            Revisa el detalle del evento y completa el pago de forma segura.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <ResumenPedido
            titulo={datosEvento.titulo}
            fecha={datosEvento.fecha}
            lugar={datosEvento.lugar}
            items={datosEvento.items}
          />

          <CheckoutClient total={datosEvento.total} />
        </div>
      </section>
    </main>
  );
}
