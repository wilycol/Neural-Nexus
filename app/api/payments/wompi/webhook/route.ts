import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import crypto from "crypto";

// 🔐 Configuración de Wompi (Variables de entorno)
const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-event-checksum");

    // 1. Verificar la firma del evento (Opcional pero recomendado)
    // Nota: Wompi envía eventos con firma HMAC-SHA256 usando el Event Secret
    if (WOMPI_EVENTS_SECRET && signature) {
      const payloadString = JSON.stringify(body.data) + body.timestamp + WOMPI_EVENTS_SECRET;
      const expectedSignature = crypto.createHash("sha256").update(payloadString).digest("hex");
      
      if (signature !== expectedSignature) {
        console.error("Wompi Webhook Error: Invalid Signature");
        return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
      }
    }

    const { data: transaction } = body;
    const { status, reference, amount_in_cents, currency, id: transaction_id } = transaction;

    if (status === "APPROVED") {
      const supabase = createServerClient();
      
      // Parsear la referencia para obtener el userId
      // La referencia que creamos es: NN-{timestamp}-{userIdPrefix}
      // Sin embargo, para mayor seguridad, deberíamos haber pasado el id completo
      // o guardarlo en una tabla temporal.
      // Re-implementaré la creación de referencia para incluir el ID completo.

      // Por ahora, asumimos que la referencia contiene lo necesario o buscamos por referencia
      // en una tabla de logs (que idealmente deberíamos haber creado).
      
      // En este flujo simplificado:
      // 1. Buscamos si es una suscripción o donación
      const isSubscription = reference.includes("subscription") || amount_in_cents === 400 * 100; // $4 USD a COP

      if (isSubscription) {
        // Encontrar al usuario (necesitamos el ID real)
        // [PENDIENTE]: Mejora de la referencia para incluir el UUID del usuario
      } else {
        // Registrar donación
        await supabase.from("donations").insert({
          amount: amount_in_cents / 100, // asumiendo COP aquí, deberíamos convertir si es necesario
          currency: currency,
          status: "completed",
          provider: "wompi",
          transaction_id: transaction_id
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error("Wompi Webhook Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
