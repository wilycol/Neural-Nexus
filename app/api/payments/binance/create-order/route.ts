import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import crypto from "crypto";

// 🔐 Configuración de Binance Pay (Variables de entorno)
const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY;
const BINANCE_ENDPOINT = "https://bpay.binanceapi.com/binancepay/openapi/v2/order";

function generateSignature(payload: string, secret: string) {
  return crypto
    .createHmac("sha512", secret)
    .update(payload)
    .digest("hex")
    .toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { amount, type } = await request.json();
    const supabase = createServerClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!BINANCE_API_KEY || !BINANCE_SECRET_KEY) {
      console.error("Faltan llaves de BINANCE en .env");
      return NextResponse.json({ error: "Servicio no configurado" }, { status: 500 });
    }

    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString("hex");

    const body = {
      env: { terminalType: "WEB" },
      orderAmount: amount,
      orderCurrency: "USD",
      merchantTradeNo: `NN-${Date.now()}-${session.user.id.slice(0, 8)}`,
      goods: {
        goodsType: "01",
        goodsCategory: "Z000",
        referenceGoodsId: type === 'subscription' ? "premium_monthly" : "donation",
        goodsName: type === 'subscription' ? "Nexus Premium 1 Mes" : "Donación Neural Nexus",
      },
      checkoutUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`,
    };

    const payload = `${timestamp}\n${nonce}\n${JSON.stringify(body)}\n`;
    const signature = generateSignature(payload, BINANCE_SECRET_KEY);

    const response = await fetch(BINANCE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": timestamp.toString(),
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": BINANCE_API_KEY,
        "BinancePay-Signature": signature,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.status === "SUCCESS") {
      return NextResponse.json({ url: data.data.checkoutUrl });
    } else {
      console.error("Binance API Error:", data);
      return NextResponse.json({ error: data.errorMessage || "Error de Binance" }, { status: 400 });
    }
  } catch (err) {
    console.error("Create Order Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
