
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { performSystemAudit } from '@/lib/auditService';

export const dynamic = "force-dynamic";

/**
 * Beatriz Elite Cron: Integrity Audit 🛡️
 * Este endpoint dispara la auditoría semanal y persiste los resultados para el Admin Panel.
 */
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const startedAt = new Date().toISOString();

  try {
    // 1. Verificación de Seguridad (CRON_SECRET)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Si hay un secreto configurado, lo validamos
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Ejecutar Auditoría Industrial
    console.log(`[${startedAt}] 🛡️ Iniciando Auditoría de Integridad...`);
    const auditResults = await performSystemAudit();

    // 3. Persistir Resultados en el Storage de Auditoría
    // Guardamos un histórico para que el Dashboard pueda consultarlo
    const fileName = `audit-${new Date().toISOString().split('T')[0]}.json`;
    const { error: storageError } = await supabase
      .storage
      .from('system-integrity') // Asegúrate de crear este bucket en el dashboard de Supabase o lo crearemos vía código
      .upload(fileName, JSON.stringify(auditResults, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    if (storageError) {
      console.warn('⚠️ No se pudo persistir el log en storage, pero la auditoría fue exitosa:', storageError.message);
    }

    return NextResponse.json({
      success: true,
      timestamp: startedAt,
      message: 'Auditoría completada y protegida.',
      results: auditResults
    });

  } catch (error) {
    console.error('❌ Error fatal en Cron de Auditoría:', error);
    return NextResponse.json(
      { error: 'Error en el procesamiento de integridad' },
      { status: 500 }
    );
  }
}
