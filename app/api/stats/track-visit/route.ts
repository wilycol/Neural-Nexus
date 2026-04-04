import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = createServerClient();
    
    // Llamar al RPC que maneja el upsert de hoy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).rpc('increment_daily_views');

    if (error) {
      console.error('Error tracking visit:', error);
      return NextResponse.json({ error: 'Error al registrar visita' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in track-visit API:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
