import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Usamos sandbox por defecto según las credenciales del usuario

/**
 * Genera el token de acceso de PayPal
 */
async function generateAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error("Missing PayPal credentials");
  }
  
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Captura la orden de PayPal
 */
async function captureOrder(orderID: string) {
  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await response.json();
}

export async function POST(request: Request) {
  try {
    const { orderID, isAnonymous, donorName: manualDonorName } = await request.json();
    
    // 1. Capturar el pago en PayPal
    const captureData = await captureOrder(orderID);
    
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // 2. Registrar en Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const amount = parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value);
    const currency = captureData.purchase_units[0].payments.captures[0].amount.currency_code;
    const donorName = manualDonorName || captureData.payer.name.given_name + " " + captureData.payer.name.surname;

    const { error: donationError } = await supabase
      .from("donations")
      .insert({
        user_id: user?.id || null,
        amount,
        currency,
        donor_name: donorName,
        comment: isAnonymous ? "Donación Anónima" : null,
        is_public: !isAnonymous,
        provider: "paypal",
        transaction_id: captureData.id,
      });

    if (donationError) {
      console.error("Error saving donation:", donationError);
      // No devolvemos error 500 porque el pago YA se capturó. Registramos el log.
    }

    // 3. Respuesta industrial
    return NextResponse.json({ 
      status: "success", 
      id: captureData.id,
      rank_upgrade: !isAnonymous && user ? true : false
    });

  } catch (error: any) {
    console.error("PayPal Capture Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
