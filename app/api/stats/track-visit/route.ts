import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createServerClient();
    
    const { error } = await (supabase as unknown as { 
      rpc: (name: 'increment_site_metric', args: { metric_id: string }) => Promise<{ error: unknown }> 
    }).rpc('increment_site_metric', { 
      metric_id: 'total_site_views' 
    });

    if (error) {
      console.error('Error tracking site visit:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
