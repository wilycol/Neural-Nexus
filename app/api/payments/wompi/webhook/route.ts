import { createSupabaseAdmin } from "@/lib/supabase-server";
import { sendTelegramSaleAlert, sendWhatsAppOnboardingTemplate } from "@/lib/notifications";
import { NextResponse } from "next/server";
import crypto from "crypto";

// 🔐 Configuración de Wompi (Variables de entorno)
const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-event-checksum");

    // 1. Verificar la firma del evento (si está configurada la llave secreta)
    if (WOMPI_EVENTS_SECRET && signature) {
      const payloadString = JSON.stringify(body.data) + body.timestamp + WOMPI_EVENTS_SECRET;
      const expectedSignature = crypto.createHash("sha256").update(payloadString).digest("hex");

      if (signature !== expectedSignature) {
        console.error("❌ [WOMPI-WEBHOOK] Firma de integridad inválida");
        return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
      }
    }

    const { data: transaction } = body;
    if (!transaction) {
      return NextResponse.json({ error: "No transaction data" }, { status: 400 });
    }

    const {
      status,
      reference,
      amount_in_cents,
      currency,
      id: transaction_id,
      customer_email,
      customer_data,
      payment_method,
    } = transaction;

    console.log(`📡 [WOMPI-WEBHOOK] Transacción recibida: ${transaction_id} | Ref: ${reference} | Estado: ${status}`);

    if (status === "APPROVED") {
      const supabase = createSupabaseAdmin();

      // 2. Extraer datos del cliente (Cold Lead o Registrado)
      const customerEmail = customer_email || (customer_data && customer_data.email) || "cliente_anonimo@neuralnexus.ai";
      const customerName = (customer_data && customer_data.full_name) || "Cliente Distinguido";
      const customerPhone =
        (customer_data && customer_data.phone_number) ||
        (payment_method && payment_method.phone_number) ||
        "";

      // 3. Determinar el Plan o Producto según referencia y monto
      let planName = "Growth";
      const refLower = (reference || "").toLowerCase();
      if (refLower.includes("starter") || amount_in_cents <= 10000000) {
        planName = "Starter";
      } else if (refLower.includes("enterprise") || amount_in_cents >= 100000000) {
        planName = "Enterprise";
      } else if (refLower.includes("kitsune_single") || amount_in_cents === 10000000) {
        planName = "Kitsune Video Ad (Individual)";
      } else if (refLower.includes("kitsune_pack") || amount_in_cents === 40000000) {
        planName = "Kitsune Video Ads (Pack 5)";
      }

      // 4. Verificar si el usuario ya existe en Supabase
      let isNewUser = false;
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("id, email, role")
        .eq("email", customerEmail)
        .maybeSingle();

      if (findError) {
        console.warn("⚠️ [WOMPI-WEBHOOK] Advertencia al consultar usuario:", findError.message);
      }

      let userId = existingUser?.id;

      if (!existingUser) {
        // ✨ Auto-Registro de Cliente en Frío
        console.log(`✨ [WOMPI-WEBHOOK] Auto-registrando nuevo cliente en frío: ${customerEmail}`);
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            email: customerEmail,
            nickname: customerName,
            role: "user",
            is_premium: true,
            badge_level: 2,
            wompi_customer_id: customerPhone || transaction_id,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("❌ [WOMPI-WEBHOOK] Error al auto-registrar usuario:", insertError.message);
        } else {
          userId = newUser?.id;
          isNewUser = true;
        }
      } else {
        // Actualizar usuario a Premium
        console.log(`🔄 [WOMPI-WEBHOOK] Actualizando usuario existente (${customerEmail}) a Premium`);
        await supabase
          .from("users")
          .update({
            is_premium: true,
            badge_level: 2,
          })
          .eq("id", existingUser.id);
      }

      // 5. Registrar Transacción / Donación en Supabase
      try {
        await supabase.from("donations").insert({
          amount: amount_in_cents / 100,
          currency: currency || "COP",
          status: "completed",
          provider: "wompi",
          transaction_id: transaction_id,
        });
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.warn("⚠️ [WOMPI-WEBHOOK] Tabla donations no disponible o error al insertar:", errorMsg);
      }

      // 6. Despachar Alertas en Paralelo (Telegram Búnker + WhatsApp Cliente)
      const notificationsPromises = [];

      // A) Alerta Push a Telegram para Wily & Beatriz
      notificationsPromises.push(
        sendTelegramSaleAlert({
          customerName,
          customerPhone: customerPhone || "No especificado",
          customerEmail,
          plan: planName,
          amountInCents: amount_in_cents,
          currency: currency || "COP",
          transactionId: transaction_id,
          isNewUser,
        })
      );

      // B) Disparo de Plantilla Oficial de WhatsApp al Cliente
      if (customerPhone) {
        notificationsPromises.push(
          sendWhatsAppOnboardingTemplate({
            phone: customerPhone,
            customerName,
            plan: planName,
          })
        );
      } else {
        console.warn(`⚠️ [WOMPI-WEBHOOK] No se detectó número de teléfono para enviar WhatsApp al cliente (${customerEmail})`);
      }

      // Ejecución no bloqueante
      await Promise.allSettled(notificationsPromises);

      return NextResponse.json({
        received: true,
        status: "APPROVED_PROCESSED",
        is_new_user: isNewUser,
        user_id: userId,
        plan: planName,
      });
    }

    return NextResponse.json({ received: true, status: status });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ [WOMPI-WEBHOOK] Excepción en webhook:", errorMsg);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
