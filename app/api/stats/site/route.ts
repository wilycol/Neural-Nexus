import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // El RPC devuelve un objeto JSON directamente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc('get_site_wide_stats');

    if (rpcError) {
      console.error('Error fetching site stats:', rpcError);
      return NextResponse.json({ 
        error: 'Database error', 
        details: rpcError.message,
        hint: rpcError.hint,
        code: rpcError.code 
      }, { status: 500 });
    }

    // Al ser un RETURNS TABLE, Supabase devuelve un array. Tomamos el primer elemento.
    const stats = Array.isArray(rpcData) ? rpcData[0] : rpcData;

    return NextResponse.json({ data: stats });
  } catch (err: unknown) {
    console.error('CRITICAL ERROR in site stats API:', err);
    return NextResponse.json({ 
      error: 'Internal Error', 
      message: err instanceof Error ? err.message : 'Unknown error' 
    }, { status: 500 });
  }
}
