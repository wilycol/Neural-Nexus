import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

/**
 * API Administrativa para Consultar Misiones de Beatriz Factoría (Protocolo Alpha)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 1. Verificar Rol Admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Prohibido: Solo acceso para Comandantes' }, { status: 403 });
    }

    // 2. Consultar Misiones
    let query = supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('factory_missions' as any)
      .select('*, news(title, slug)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [Admin API] Error fetching missions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success', 
      count: data?.length || 0,
      data 
    });

  } catch (error) {
    console.error('❌ [Admin API] Critical error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
