import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data: rpcData, error: rpcError } = await (supabase as unknown as { 
      rpc: (n: string) => { single: () => Promise<{ data: { total_views: number, total_users: number, total_news: number } | null, error: { message: string } | null }> } 
    })
      .rpc('get_site_wide_stats')
      .single();

    if (rpcError) {
      console.error('Error fetching site stats:', rpcError);
      return NextResponse.json({ error: 'Database error', details: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({ data: rpcData });
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
