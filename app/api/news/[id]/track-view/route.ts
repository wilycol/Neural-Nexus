import { createSupabaseAdmin } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 1. Intentar inicializar el cliente Admin
    let supabase;
    try {
      supabase = createSupabaseAdmin();
    } catch (adminError: any) {
      console.error('Error initializing Admin client (track-view):', adminError.message);
      return NextResponse.json({ 
        error: 'Admin Client Error', 
        details: adminError.message,
        hint: 'Verifica que SUPABASE_SERVICE_ROLE_KEY esté configurada en Vercel' 
      }, { status: 500 });
    }

    // 2. Ejecutar RPC con el prefijo p_
    const { error } = await (supabase as unknown as { 
      rpc: (name: string, args: Record<string, unknown>) => Promise<{ error: unknown }> 
    }).rpc('increment_item_view', { 
      p_item_id: id,
      p_table_name: 'news'
    });

    if (error) {
      console.error('Error tracking view (RPC):', error);
      return NextResponse.json({ error: 'Database RPC error', details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Crash in track-view:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: err?.message || 'Unknown error' 
    }, { status: 500 });
  }
}
