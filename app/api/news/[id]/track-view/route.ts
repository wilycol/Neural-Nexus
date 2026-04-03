import { createServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const id = params.id;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await (supabase as unknown as { 
      rpc: (name: 'increment_item_view', args: { item_id: string; table_name: string }) => Promise<{ error: unknown }> 
    }).rpc('increment_item_view', { 
      item_id: id,
      table_name: 'news' 
    });

    if (error) {
      console.error('Error tracking news view:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
