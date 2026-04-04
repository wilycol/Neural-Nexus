import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Escudo de Cookies: Revisar si ya contamos a este usuario hoy
    const cookieStore = cookies();
    const today = new Date().toISOString().split('T')[0];
    const cookieName = `nn_tracked_${today}`;
    
    if (cookieStore.get(cookieName)) {
      return NextResponse.json({ success: true, message: 'Already tracked' });
    }

    const supabase = createServerClient();
    
    // 2. Llamar al RPC para incrementar la vista
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).rpc('increment_daily_views');

    if (error) {
      console.error('Error tracking visit:', error);
      return NextResponse.json({ error: 'Error al registrar visita' }, { status: 500 });
    }

    // 3. Marcar como rastreado en las cookies (expira en 24h)
    cookieStore.set(cookieName, 'true', { 
      maxAge: 60 * 60 * 24, 
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in track-visit API:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
