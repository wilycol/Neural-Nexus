import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_site_wide_stats');

    if (rpcError) {
      console.error('Error fetching site stats:', rpcError);
      return NextResponse.json({ error: 'Database error', details: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({ data: rpcData });
  } catch (err: any) {
    console.error('CRITICAL ERROR in site stats API:', err);
    return NextResponse.json({ error: 'Internal Error', message: err.message }, { status: 500 });
  }
}
