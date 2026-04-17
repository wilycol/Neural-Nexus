import { createServerClient, createSupabaseAdmin } from "@/lib/supabase-server";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox';
const PAYPAL_API = PAYPAL_ENV === 'live' 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

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
    const { orderID, isAnonymous, donorName: manualDonorName, type = 'donation' } = await request.json();
    
    // 1. Capturar el pago en PayPal
    const captureData = await captureOrder(orderID);
    
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // 2. Registrar en Supabase con privilegios elevados para evitar bloqueos de RLS en visitantes
    const supabase = createServerClient();
    const supabaseAdmin = createSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();

    const amount = parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value);
    const currency = captureData.purchase_units[0].payments.captures[0].amount.currency_code;
    const donorName = manualDonorName || captureData.payer.name.given_name + " " + captureData.payer.name.surname;

    // A. Registrar la donación/pago en el historial (Usando admin para asegurar el registro)
    const { error: donationError } = await supabaseAdmin
      .from("donations")
      .insert({
        user_id: user?.id || null,
        amount,
        currency,
        donor_name: donorName,
        comment: type === 'subscription' ? "Suscripción Premium" : (isAnonymous ? "Donación Anónima" : null),
        is_public: type === 'subscription' ? false : !isAnonymous,
        provider: "paypal",
        transaction_id: captureData.id,
      });

    if (donationError) {
      console.error("Error saving donation (Supabase Error):", donationError);
      // Opcional: Podrías querer lanzar un error aquí para que el frontend sepa que falló el registro
    }

    // B. Si es suscripción, ACTIVAR PREMIUM instantáneamente (Usando admin)
    if (type === 'subscription' && user) {
      console.log(`[PayPal] 🚀 Activando Premium para usuario: ${user.email}`);
      const { error: premiumError } = await supabaseAdmin
        .from("users")
        .update({ is_premium: true })
        .eq("id", user.id);

      if (premiumError) {
        console.error("Error activating premium:", premiumError);
      }
    }

    // 3. Respuesta industrial
    return NextResponse.json({ 
      status: "success", 
      id: captureData.id,
      rank_upgrade: type === 'subscription' ? true : (!isAnonymous && user ? true : false)
    });

  } catch (error: unknown) {
    console.error("PayPal Capture Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
