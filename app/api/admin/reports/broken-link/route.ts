import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = "force-dynamic";

/**
 * API: Reporte de Integridad (Broken Link) 🛡️
 * Recibe reportes de activos que fallan al cargar y los registra en admin_alerts.
 */
export async function POST(request: Request) {
  const supabase = createServerClient();

  try {
    const { newsId, url, type, title } = await request.json();

    if (!newsId || !url) {
      return NextResponse.json({ error: 'Datos insuficientes' }, { status: 400 });
    }

    // 1. Verificar si ya existe un reporte reciente para esta noticia
    const { data: existing } = await supabase
      .from('admin_alerts')
      .select('id')
      .eq('target_id', newsId)
      .eq('type', 'link_broken')
      .eq('status', 'pending')
      .single();

    if (existing) {
      return NextResponse.json({ success: true, message: 'Reporte ya existente' });
    }

    // 2. Insertar nueva alerta administrativa
    const { error } = await supabase
      .from('admin_alerts')
      .insert({
        type: 'link_broken',
        title: `⚠️ Link Roto Detectado: ${title || 'Noticia ID ' + newsId}`,
        message: `El activo en ${url} devolvió un error de carga (404/403). La noticia ha sido ocultada automáticamente.`,
        target_id: newsId,
        severity: 'warning',
        metadata: { url, reported_at: new Date().toISOString() }
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Alerta de integridad registrada.'
    });

  } catch (error) {
    console.error('❌ Error reportando link roto:', error);
    return NextResponse.json(
      { error: 'Error al procesar reporte' },
      { status: 500 }
    );
  }
}
