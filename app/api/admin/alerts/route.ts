import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = "force-dynamic";

/**
 * API Administrador: Gestión de Alertas Industriales 🚨
 * Permite listar y resolver alertas de integridad y ciclo de vida.
 */
export async function GET() {
  const supabase = createServerClient();

  try {
    // 1. Verificar Autenticación (Solo Admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

    // 2. Obtener Alertas Pendientes
    const { data, error } = await supabase
      .from('admin_alerts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ Error en API de Alertas:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    // Resolver alerta
    const { error } = await supabase
      .from('admin_alerts')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Alerta resuelta' });

  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar alerta' }, { status: 500 });
  }
}
