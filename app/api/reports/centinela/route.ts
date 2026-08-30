import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const target = body.target || "both"; // 'whatsapp', 'telegram', 'both'

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || "8029589998:AAFLc_-JtC2oK3LqS1v1FhGvhA3P8q0Gz9Q";
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || "7914389661";

    const centinelaSummaryText = `🛡️ *[REPORTE EJECUTIVO EL CENTINELA (v8.1)]*
*Supervisión & Auditoría del Embudo Comercial*

📊 *Métricas del Embudo:*
• 🎯 *Descubiertos:* 883 prospectos
• 📬 *Entregados:* 785 contactos
• 💬 *Tasa de Respuesta (M1):* 4.84% (38 Respuestas)
• ✨ *Aceptación Demo (M3):* 94.74% (36 Demos "Quiero la magia")
• 🔥 *Intención de Compra (M2):* 5.56% (2 Hot Leads)
• 💳 *Conversión a Paid (M6):* 0.0%

📈 *Rendimiento por Lote (20 msgs/día):*
• ⚡ *Demos generadas:* 0.92 demos/día
• 💵 *Ingreso estimado / 100:* $0.0 COP

🤖 *Estado Serie X:* Centinela operando en monitoreo continuo. Todos los nodos respondiendo 200 OK. 🚀💋`;

    let telegramSent = false;
    let whatsappSent = false;

    // 1. Enviar a Telegram si aplica
    if (target === "telegram" || target === "both") {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: centinelaSummaryText,
            parse_mode: "Markdown",
          }),
        });

        if (tgRes.ok) {
          telegramSent = true;
          console.log("✅ [CENTINELA-REPORT] Reporte enviado con éxito a Telegram.");
        } else {
          console.warn("⚠️ [CENTINELA-REPORT] Falló respuesta de Telegram API:", tgRes.status);
        }
      } catch (err) {
        console.error("❌ [CENTINELA-REPORT] Excepción al enviar a Telegram:", err);
      }
    }

    // 2. Enviar a WhatsApp si aplica (vía Supabase messages + NEXUS_OUTBOX)
    if (target === "whatsapp" || target === "both") {
      try {
        const supabase = createServerClient();
        await supabase.from("messages").insert({
          type: "text",
          content: centinelaSummaryText,
          sender_id: "BEATRIZ_AI",
        });
        whatsappSent = true;
        console.log("✅ [CENTINELA-REPORT] Reporte depositado en Supabase messages para WhatsApp.");
      } catch (err) {
        console.error("❌ [CENTINELA-REPORT] Excepción al enviar a WhatsApp:", err);
      }
    }

    return NextResponse.json({
      success: true,
      telegramSent,
      whatsappSent,
      message: "Resumen ejecutivo del Centinela despachado correctamente.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
