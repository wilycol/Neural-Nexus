import { createSupabaseAdmin } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 1. Intentar inicializar el cliente Admin
    let supabase;
    try {
      supabase = createSupabaseAdmin();
    } catch (adminError: unknown) {
      const message = adminError instanceof Error ? adminError.message : 'Unknown error';
      console.error('Error initializing Admin client:', message);
      return NextResponse.json({ 
        error: 'Admin Client Error', 
        details: message,
        hint: 'Verifica que SUPABASE_SERVICE_ROLE_KEY esté configurada en Vercel' 
      }, { status: 500 });
    }

    // 2. Ejecutar RPC con el prefijo p_
    const { error } = await (supabase as unknown as { 
      rpc: (name: string, args: Record<string, unknown>) => Promise<{ error: unknown }> 
    }).rpc('increment_site_metric', { 
      p_metric_id: 'total_site_views' 
    });

    if (error) {
      console.error('Error tracking site visit (RPC):', error);
      return NextResponse.json({ error: 'Database RPC error', details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Crash in track-visit:', message);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: message 
    }, { status: 500 });
  }
}
