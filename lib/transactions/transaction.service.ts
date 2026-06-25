import { validarComprador } from "@/lib/auth/buyer.validation";
import { validarApiKey } from "@/lib/auth/apiKey";
import prisma from "@/lib/db/prisma";
import { calcularComisionVenta } from "@/lib/payments/comisiones";
import { crearPreferenciaPago } from "@/lib/payments/preference.service";
import { obtenerIdOrganizador } from "@/lib/seller/seller.service";
import { validarBodyNuevaTransaccion } from "@/lib/transactions/transaction.validation";
import { ErrorRespuestaHttp } from "@/lib/http/api-error";

export async function crearTransaccionCompleta(request: Request) {
  const body = await request.json();
  const datos = validarBodyNuevaTransaccion(body);

  const apiKeyValida = process.env.PAYMENTS_API_KEY
    ? validarApiKey(request, process.env.PAYMENTS_API_KEY)
    : false;

  if (!apiKeyValida) {
    throw new ErrorRespuestaHttp(401, {
      error: "API key invalida",
    });
  }

  await validarComprador(datos.idComprador);

  const origen = new URL(request.url).origin;
  const idOrganizador = await obtenerIdOrganizador(datos.idEvento);
  const comision = calcularComisionVenta(datos.monto);

  await prisma.vendedor.upsert({
    where: { id_vendedor: idOrganizador },
    update: {
      nombre: `Vendedor Sandbox Evento ${datos.idEvento}`,
      email: `vendedor.${idOrganizador}@eventia.test`,
    },
    create: {
      id_vendedor: idOrganizador,
      nombre: `Vendedor Sandbox Evento ${datos.idEvento}`,
      email: `vendedor.${idOrganizador}@eventia.test`,
    },
  });

  const transaccion = await prisma.transaccion.create({
    data: {
      id_pedido: datos.idPedido,
      id_comprador: datos.idComprador,
      id_vendedor: idOrganizador,
      monto: datos.monto,
      moneda: "ARS",
    },
  });

  const referenciaPago = String(transaccion.id_transaccion);
  const respuestaPreferencia = await crearPreferenciaPago({
    idTransaccion: transaccion.id_transaccion,
    idPedido: datos.idPedido,
    monto: comision.montoTotalComprador,
    origen,
  });

  if (!respuestaPreferencia?.id) {
    throw new Error("No se pudo crear la preferencia de pago");
  }

  const transaccionActualizada = await prisma.transaccion.update({
    where: { id_transaccion: transaccion.id_transaccion },
    data: {
      id_preferencia_pago: respuestaPreferencia.id,
      referencia_pago: referenciaPago,
      estado_proveedor: "preferencia_creada",
    },
  });

  return {
    idTransaccion: transaccionActualizada.id_transaccion,
    idPedido: transaccionActualizada.id_pedido,
    preferenceId: respuestaPreferencia.id,
    estado: transaccionActualizada.estado_transaccion,
  };
}
