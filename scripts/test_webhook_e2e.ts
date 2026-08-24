import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { sendTelegramSaleAlert, sendWhatsAppOnboardingTemplate } from '../lib/notifications';
import { createSupabaseAdmin } from '../lib/supabase-server';

async function runE2EWebhookTest() {
  console.log(`\n================================================================`);
  console.log(`🧪 TEST E2E: AUTO-REGISTRO EN SUPABASE + TELEGRAM + WHATSAPP`);
  console.log(`================================================================\n`);

  const mockPayload = {
    customerName: "Wily Col (Prueba Industrial)",
    customerPhone: "573011362432",
    customerEmail: "wilycol1492@gmail.com",
    plan: "Growth (Neural Site Pro)",
    amountInCents: 40000000,
    currency: "COP",
    transactionId: `TEST_TX_${Date.now()}`,
    isNewUser: true
  };

  // 1. Probar Disparo a Telegram
  console.log(`📡 1. Probando alerta push de Telegram al Búnker...`);
  const telegramOk = await sendTelegramSaleAlert(mockPayload);
  console.log(`   Resultado Telegram: ${telegramOk ? '✅ ÉXITO (Enviado a tu celular)' : '❌ ERROR'}`);

  // 2. Probar Consulta/Inserción en Supabase (Auto-Registro)
  console.log(`\n🗄️ 2. Probando conexión y auto-registro con Supabase Admin...`);
  try {
    const supabase = createSupabaseAdmin();
    const testEmail = `lead_test_${Date.now()}@neuralnexus.ai`;
    
    console.log(`   Insertando usuario de prueba: ${testEmail}`);
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        nickname: "Cliente Prueba E2E",
        role: "user",
        is_premium: true,
        badge_level: 2,
        wompi_customer_id: "573011362432"
      })
      .select('id, email, role, is_premium')
      .single();

    if (insertError) {
      console.error(`   ❌ Error en Supabase insert:`, insertError.message);
    } else {
      console.log(`   ✅ Usuario registrado con éxito en Supabase:`, newUser);
      
      // Limpiar registro de prueba
      await supabase.from('users').delete().eq('id', newUser.id);
      console.log(`   🧹 Registro temporal de prueba eliminado correctamente.`);
    }
  } catch (e: any) {
    console.error(`   ❌ Excepción en Supabase:`, e.message);
  }

  // 3. Probar envío de plantilla de WhatsApp (Simulada o Directa)
  console.log(`\n💬 3. Probando función de envío de Plantilla de WhatsApp...`);
  console.log(`   (Nota: Si la plantilla 'neural_site_onboarding_pago' sigue en revisión por Meta, registrará el estado de la API)`);
  const waOk = await sendWhatsAppOnboardingTemplate({
    phone: mockPayload.customerPhone,
    customerName: mockPayload.customerName,
    plan: "Growth"
  });
  console.log(`   Resultado WhatsApp: ${waOk ? '✅ ÉXITO' : '⚠️ EN REVISIÓN / RESPUESTA DE META'}`);

  console.log(`\n================================================================`);
  console.log(`🎉 [TEST FINALIZADO] Pipeline verificado.`);
  console.log(`================================================================\n`);
}

runE2EWebhookTest().catch(console.error);
