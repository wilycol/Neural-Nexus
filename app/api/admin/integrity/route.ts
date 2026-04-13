
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { performSystemAudit } from '@/lib/auditService';

export const dynamic = "force-dynamic";

/**
 * API Administrador: Integridad del Sistema 🛡️
 * Provee los datos para el Integrity Dashboard.
 */
export async function GET(request: NextRequest) {
  const supabase = createServerClient();

  try {
    // 1. Verificar Autenticación (Solo Admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar Rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Prohibido: Solo nivel Admin' }, { status: 403 });
    }

    // 2. Ejecutar Auditoría Industrial (Tiempo Real)
    // Nota: Para sistemas muy grandes, esto debería leer de la tabla audit_logs
    const results = await performSystemAudit();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: results
    });

  } catch (error) {
    console.error('❌ Error en API de Integridad:', error);
    return NextResponse.json(
      { error: 'Falla crítica de comunicación con el núcleo de integridad.' },
      { status: 500 }
    );
  }
}
