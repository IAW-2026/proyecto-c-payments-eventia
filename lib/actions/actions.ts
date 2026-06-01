'use server';

import { crearPreferenciaPago } from "@/lib/payments/mercadopago";

type DatosCrearPago = {
  idTransaccion: number;
  idPedido: number;
  monto: number;
};

export async function crearPago(datos?: DatosCrearPago) {
  const idPedido = datos?.idPedido ?? 1;
  const monto = datos?.monto ?? 100;

  try {
    const res = await crearPreferenciaPago({
      idTransaccion: datos?.idTransaccion,
      idPedido,
      monto,
    });

    console.log("Preferencia generada con exito", res.id);

    return { id: res.id };
  } catch (error) {
    console.error("Error detallado de MP:", error);
    return null;
  }
}
