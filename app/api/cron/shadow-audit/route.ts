
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = "force-dynamic";

/**
 * 🕶️ El Vigía: Shadow Audit Trigger
 * Horario: Domingos 19:00 COL (00:00 UTC)
 * Misión: Disparar el duelo semanal entre Beatriz y El Vigía.
 */
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const startedAt = new Date().toISOString();

  try {
    // 1. Verificación de Seguridad
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Insertar Misión de Duelo en la Cola
    console.log(`[${startedAt}] 🕶️ Disparando Duelo en la Sombra del Vigía...`);
    
    const { error: missionError } = await supabase
      .from('factory_missions' as any)
      .insert([
        {
          title: '🕶️ EL VIGÍA: SHADOW AUDIT',
          description: 'Duelo semanal de integridad y OSINT.',
          content: JSON.stringify({
            category: 'AI & Software',
            intensity: 5,
            vigia_mode: true
          }),
          status: 'pending',
          updated_at: new Date().toISOString()
        }
      ]);

    if (missionError) {
        throw missionError;
    }

    return NextResponse.json({
      success: true,
      timestamp: startedAt,
      message: 'Misión del Vigía enviada al Happy Bridge. El duelo comenzará pronto.'
    });

  } catch (error) {
    console.error('❌ Error fatal en Cron del Vigía:', error);
    return NextResponse.json(
      { error: 'Error al disparar el Shadow Audit' },
      { status: 500 }
    );
  }
}
