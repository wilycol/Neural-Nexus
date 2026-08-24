export interface SaleNotificationData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  plan: string;
  amountInCents: number;
  currency: string;
  transactionId: string;
  isNewUser: boolean;
}

/**
 * ✈️ Envía una alerta de venta inmediata al Búnker vía Telegram Bot
 */
export async function sendTelegramSaleAlert(data: SaleNotificationData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ [TELEGRAM-ALERT] Faltan variables TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID");
    return false;
  }

  const amountFormatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: data.currency || "COP",
    maximumFractionDigits: 0,
  }).format(data.amountInCents / 100);

  const message = `💰 *¡NUEVA VENTA CONFIRMADA EN PORTAL NEURAL NEXUS!* 💰\n\n` +
    `👤 *Cliente:* ${data.customerName}\n` +
    `📱 *WhatsApp:* +${data.customerPhone}\n` +
    `📧 *Correo:* \`${data.customerEmail}\`\n` +
    `📦 *Producto:* Neural Site (${data.plan})\n` +
    `💵 *Monto:* ${amountFormatted}\n` +
    `🆔 *Ref:* \`${data.transactionId}\`\n` +
    `👤 *Estado Usuario:* ${data.isNewUser ? "✨ Nuevo Cliente (Auto-Registrado)" : "✅ Miembro Existente"}\n\n` +
    `🤖 *Acción:* Agente Seductor activado para recopilar ADN por WhatsApp. 💋🚀`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });
    if (!res.ok) {
      console.warn("⚠️ [TELEGRAM-ALERT] Error HTTP de Telegram:", res.status);
    } else {
      console.log("✅ [TELEGRAM-ALERT] Alerta de venta enviada con éxito al Búnker.");
    }
    return true;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("❌ [TELEGRAM-ALERT] Error al enviar notificación a Telegram:", errorMsg);
    return false;
  }
}

/**
 * 💬 Envía la plantilla oficial de onboarding de WhatsApp al cliente
 */
export async function sendWhatsAppOnboardingTemplate(data: {
  phone: string;
  customerName: string;
  plan: string;
}): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.warn("⚠️ [WHATSAPP-ONBOARDING] Faltan variables de WhatsApp Cloud API en .env");
    return false;
  }

  // Limpiar y asegurar formato de número de teléfono
  let cleanPhone = data.phone.replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "57" + cleanPhone; // Asumir Colombia por defecto
  }

  const sanitizedName = data.customerName.length > 30
    ? data.customerName.substring(0, 27).trim() + "..."
    : data.customerName.trim();

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  let payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: cleanPhone,
    type: "template",
    template: {
      name: "neural_site_onboarding",
      language: { code: "es_CO" },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: sanitizedName,
            },
            {
              type: "text",
              text: data.plan || "Growth",
            },
          ],
        },
      ],
    },
  };

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("⚠️ [WHATSAPP-ONBOARDING] Plantilla primaria en revisión por Meta. Activando fallback a 'pionero_invitation_v2'...");
      
      payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "template",
        template: {
          name: "pionero_invitation_v2",
          language: { code: "es_CO" },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: sanitizedName,
                },
                {
                  type: "text",
                  text: data.plan || "tu sector",
                },
              ],
            },
          ],
        },
      };

      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    console.log(`✅ [WHATSAPP-ONBOARDING] Mensaje de bienvenida entregado a +${cleanPhone}`);
    return true;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ [WHATSAPP-ONBOARDING] Error al enviar plantilla a +${cleanPhone}:`, errorMsg);
    return false;
  }
}
