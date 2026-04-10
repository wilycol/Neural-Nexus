import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import crypto from "crypto";

// 🔐 Configuración de Binance Pay (Variables de entorno)
const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const signature = request.headers.get("BinancePay-Signature");
    const timestamp = request.headers.get("BinancePay-Timestamp");
    const nonce = request.headers.get("BinancePay-Nonce");

    // 1. Verificar la firma del evento
    if (BINANCE_SECRET_KEY && signature && timestamp && nonce) {
      const payload = `${timestamp}\n${nonce}\n${rawBody}\n`;
      const expectedSignature = crypto
        .createHmac("sha512", BINANCE_SECRET_KEY)
        .update(payload)
        .digest("hex")
        .toUpperCase();

      if (signature !== expectedSignature) {
        console.error("Binance Webhook Error: Invalid Signature");
        return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
      }
    }

    const { bizStatus, merchantTradeNo, orderAmount } = body.data;

    // 2. Procesar si el pago fue exitoso
    if (bizStatus === "PAY_SUCCESS") {
      const supabase = createServerClient();
      
      // Extraer userId de la referencia (Formato: NN-{timestamp}-{userIdPrefix})
      // NOTA: Para una integración industrial, se debería usar el ID completo o un metadata
      // Pero aquí usamos la referencia como clave.
      
      // Registrar en donaciones si no es suscripción
      await supabase.from("donations").insert({
        amount: parseFloat(orderAmount),
        currency: "USD",
        status: "completed",
        payment_method: "binance",
        transaction_id: merchantTradeNo
      });

      // [TODO]: Lógica para activar suscripción si corresponde
    }

    return NextResponse.json({ returnCode: "SUCCESS", returnMsg: "OK" });

  } catch (err) {
    console.error("Binance Webhook Exception:", err);
    return NextResponse.json({ returnCode: "FAIL", returnMsg: "ERROR" }, { status: 500 });
  }
}
