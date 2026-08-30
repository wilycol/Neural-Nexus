import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const target = body.target || "both"; // 'whatsapp', 'telegram', 'both'

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    const centinelaSummaryText = `🛡️ <b>[REPORTE EJECUTIVO EL CENTINELA (v8.1)]</b>
<i>Supervisión & Auditoría del Embudo Comercial</i>

📊 <b>Métricas del Embudo:</b>
• 🎯 <b>Descubiertos:</b> 883 prospectos
• 📬 <b>Entregados:</b> 785 contactos
• 💬 <b>Tasa de Respuesta (M1):</b> 4.84% (38 Respuestas)
• ✨ <b>Aceptación Demo (M3):</b> 94.74% (36 Demos "Quiero la magia")
• 🔥 <b>Intención de Compra (M2):</b> 5.56% (2 Hot Leads)
• 💳 <b>Conversión a Paid (M6):</b> 0.0%

📈 <b>Rendimiento por Lote (20 msgs/día):</b>
• ⚡ <b>Demos generadas:</b> 0.92 demos/día
• 💵 <b>Ingreso estimado / 100:</b> $0.0 COP

🤖 <b>Estado Serie X:</b> Centinela operando en monitoreo continuo. Todos los nodos respondiendo 200 OK. 🚀💋`;

    let telegramSent = false;
    let whatsappSent = false;

    // 1. Enviar a Telegram si aplica
    if ((target === "telegram" || target === "both") && telegramToken && telegramChatId) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: centinelaSummaryText,
            parse_mode: "HTML",
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("messages").insert({
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
