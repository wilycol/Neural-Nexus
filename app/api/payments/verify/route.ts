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
    const isSetup = sku.includes('SETUP');
    
    if (sku.includes('GOLD')) planName = 'gold';
    if (sku.includes('PLATINUM')) planName = 'platinum';

    // 2. Registrar/Actualizar Suscripción
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        price_id: `price_${planName}`,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: expiresAt.toISOString(),
        provider: 'wompi'
      });

    if (subError) throw subError;

    // 3. Si es un Setup, registrar la misión de construcción
    if (isSetup) {
      await supabase
        .from('client_sites')
        .insert({
          owner_id: userId,
          plan_type: planName,
          setup_status: 'pending_onboarding',
          site_name: `Nuevo Sitio de ${userId.slice(0, 5)}`,
          site_url: `https://pending-${userId.slice(0, 5)}.neuralnexus.pro`
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
            referred_id: userId
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
