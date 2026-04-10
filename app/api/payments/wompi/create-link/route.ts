import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getUSDToCOP } from "@/lib/payments/rate";

// 🔐 Configuración de Wompi (Variables de entorno)
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;
export async function POST(request: Request) {
  try {
    const { amount } = await request.json(); // amount en USD
    const supabase = createServerClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!WOMPI_PUBLIC_KEY || !WOMPI_INTEGRITY_SECRET) {
      console.error("Faltan llaves de WOMPI en .env");
      return NextResponse.json({ error: "Servicio no configurado" }, { status: 500 });
    }

    // 1. Obtener tasa de cambio para convertir USD a COP (Wompi cobra en COP)
    const { rate } = await getUSDToCOP();
    const amountInCOP = Math.round(amount * rate);
    const amountInCents = amountInCOP * 100;
    const currency = "COP";
    const reference = `NN-${Date.now()}-${session.user.id.slice(0, 8)}`;

    // 2. Generar Hash de Integridad (Requerido por Wompi para links seguros)
    // Fórmula: sha256(referencia + monto_en_centavos + moneda + secreto_integridad)
    const stringToHash = `${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`;
    const integritySignature = crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");

    // 3. Para Wompi, en lugar de una API de "orden", solemos usar el Widget o un Link de Pago.
    // Aquí generamos los parámetros necesarios para que el frontend abra el Widget o redirija.
    const redirectUrl = `https://checkout.wompi.co/p/?public-key=${WOMPI_PUBLIC_KEY}&currency=${currency}&amount-in-cents=${amountInCents}&reference=${reference}&signature:integrity=${integritySignature}&redirect-url=${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`;

    return NextResponse.json({ url: redirectUrl });

  } catch (err) {
    console.error("Wompi Create Link Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
