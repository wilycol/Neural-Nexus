import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

/**
 * 🔐 GESTIÓN DE ALIANZAS (SOLO ADMINS)
 * Permite listar y actualizar el estado de los leads industriales.
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    
    // 1. Verificar sesión y rol
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    }

    // 2. Obtener Leads
    const { data: leads, error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('partnership_leads' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: leads });

  } catch (error) {
    console.error('❌ [Admin Leads API] GET Error:', error);
    return NextResponse.json({ error: 'Error interno de red' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient();
    
    // 1. Verificar sesión y rol
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    }

    // 2. Procesar update
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'ID y Status requeridos' }, { status: 400 });

    const { data, error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('partnership_leads' as any)
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });

  } catch (error) {
    console.error('❌ [Admin Leads API] PATCH Error:', error);
    return NextResponse.json({ error: 'Error interno de red' }, { status: 500 });
  }
}
