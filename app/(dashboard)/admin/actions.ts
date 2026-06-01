"use server";

import { revalidatePath } from "next/cache";
import { protegerRutaPorRol } from "@/lib/auth/guards";

export type EstadoCancelarPedidoAdmin = {
  mensaje: string;
  tipo: "idle" | "exito" | "error";
};

type CancelarPedidoMockResponse = {
  mensaje?: string;
  error?: string;
  detalle?: string;
};

function obtenerAppUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export async function cancelarPedidoAdmin(
  _estadoPrevio: EstadoCancelarPedidoAdmin,
  formData: FormData,
): Promise<EstadoCancelarPedidoAdmin> {
  await protegerRutaPorRol(["adminPayments"]);

  const idPedido = Number(formData.get("idPedido"));

  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    return {
      tipo: "error",
      mensaje: "Ingresa un id de pedido valido.",
    };
  }

  try {
    const response = await fetch(`${obtenerAppUrl()}/api/buyer/cancelarPedidoMock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idPedido }),
    });

    const data = (await response.json()) as CancelarPedidoMockResponse;

    if (!response.ok) {
      return {
        tipo: "error",
        mensaje:
          data.detalle ?? data.error ?? "No se pudo cancelar el pedido.",
      };
    }

    revalidatePath("/admin");

    return {
      tipo: "exito",
      mensaje: `${data.mensaje ?? "Pedido cancelado"}: #${idPedido}.`,
    };
  } catch (error) {
    console.error("Error cancelando pedido desde admin:", error);

    return {
      tipo: "error",
      mensaje: "No se pudo cancelar el pedido.",
    };
  }
}
