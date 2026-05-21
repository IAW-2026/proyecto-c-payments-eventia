import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    // 1. Obtener los headers clave para la validación
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    // 2. Obtener los Query Params de la URL (Mercado Pago manda ahí el type y el data.id)
    const { searchParams } = new URL(request.url);
    const dataId = searchParams.get("data.id");
    const type = searchParams.get("type");

    // Si no viene información relevante o no hay firma, cortamos
    if (!xSignature || !dataId || type !== "payment") {
      return new NextResponse("Notificación ignorada", { status: 200 });
    }

    // 3. EXTRAER EL TIMESTAMP (ts) Y EL HASH (v1) DE LA FIRMA
    // La firma viene como: "ts=1742505638683,v1=ced36ab..."
    const parts = xSignature.split(",");
    let ts: string | null = null;
    let hash: string | null = null;

    parts.forEach((part) => {
      const [key, value] = part.split("=");
      if (key?.trim() === "ts") ts = value?.trim();
      if (key?.trim() === "v1") hash = value?.trim();
    });

    // 4. VALIDAR CONTRA TU CLAVE SECRETA (La sacás de tu panel de Mercado Pago)
    const SECRET_MERCADOPAGO = process.env.MP_WEBHOOK_SECRET || "tu_clave_secreta_aqui";

    // Armamos el template idéntico al manual
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    // Calculamos el HMAC SHA256 en formato Hexadecimal
    const hmac = crypto.createHmac("sha256", SECRET_MERCADOPAGO);
    hmac.update(manifest);
    const calculatedSignature = hmac.digest("hex");

    // Comparamos firmas para evitar fraudes
    if (calculatedSignature !== hash) {
      console.error("❌ Alerta: Firma de notificación inválida");
      return new NextResponse("Firma no coincide", { status: 401 });
    }

    console.log(`✅ Notificación legítima recibida para el pago ID: ${dataId}`);

    // 5. CONSULTAR EL ESTADO REAL DEL PAGO A MERCADO PAGO
    // Hacemos el GET al endpoint oficial que menciona tu manual
    const responsePago = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN || "tu_access_token_aqui"}`,
      },
    });

    if (!responsePago.ok) {
      throw new Error("No se pudo verificar el pago en los servidores de Mercado Pago");
    }

    const datosPago = await responsePago.json();
    const status = datosPago.status; // "approved", "pending", "rejected", etc.

    // 6. ACÁ CONECTÁS CON TU BASE DE DATOS DE NEON
    if (status === "approved") {
      console.log(`🎉 ¡El pago ${dataId} fue APROBADO!`);
      
      // Ejemplo conceptual con Prisma:
      // await prisma.inscripcion.update({
      //   where: { id: datosPago.external_reference },
      //   data: { estado: "PAGADO" }
      // });
      
    } else {
      console.log(`⚠️ El pago ${dataId} cambió al estado: ${status}`);
    }

    // 7. RESPONDER OBLIGATORIAMENTE UN 200 OK ANTES DE LOS 22 SEGUNDOS
    // Si no respondemos esto, Mercado Pago te va a reintentar mandar el webhook mil veces
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("❌ Error procesando el Webhook:", error);
    // Devolvemos 200 igual para que MP no se clave reintentando si fue un error de nuestro servidor
    return new NextResponse("Error interno procesado", { status: 200 });
  }
}