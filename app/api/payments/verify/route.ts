import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get('sku');
  const userId = searchParams.get('userId');
  const referralCode = searchParams.get('ref'); // Código de afiliado

  if (!sku || !userId) {
    return NextResponse.redirect(new URL('/es?error=missing_data', request.url));
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    // 1. Determinar el plan y monto basado en el SKU
    let planName = 'silver';
    let isSetup = sku.includes('SETUP');
    
    if (sku.includes('GOLD')) planName = 'gold';
    if (sku.includes('PLATINUM')) planName = 'platinum';

    // 2. Registrar/Actualizar Suscripción
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: planName,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_method: 'wompi'
      });

    if (subError) throw subError;

    // 3. Si es un Setup, registrar la misión de construcción
    if (isSetup) {
      await supabase
        .from('client_sites')
        .insert({
          user_id: userId,
          plan: planName,
          status: 'pending_onboarding',
          domain: `pending-${userId.slice(0, 5)}.neuralnexus.pro`
        });
    }

    // 4. Lógica de Afiliados (The 15% Commision Rule)
    if (referralCode) {
      // Buscar al dueño del código
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('affiliate_code', referralCode)
        .single();

      if (referrer) {
        await supabase
          .from('affiliate_referrals')
          .insert({
            referrer_id: referrer.id,
            referred_id: userId,
            sku_purchased: sku,
            commission_amount: 0, // Se calcula offline o por trigger
            status: 'pending_verification'
          });
      }
    }

    // REDIRECCIÓN FINAL AL ÉXITO
    return NextResponse.redirect(new URL('/es/payment/success', request.url));

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.redirect(new URL('/es?error=payment_failed', request.url));
  }
}
