import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // El RPC devuelve un objeto JSON directamente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (supabase as any)
      .rpc('get_site_wide_stats')
      .single(); 

    if (rpcError) {
      console.error('Error fetching site stats:', rpcError);
      return NextResponse.json({ error: 'Database error', details: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({ data: rpcData });
  } catch (err: unknown) {
    console.error('CRITICAL ERROR in site stats API:', err);
    return NextResponse.json({ 
      error: 'Internal Error', 
      message: err instanceof Error ? err.message : 'Unknown error' 
    }, { status: 500 });
  }
}
