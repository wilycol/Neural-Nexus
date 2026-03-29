import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .rpc('get_site_wide_stats')
      .single();

    if (error) {
      console.error('Error fetching site stats:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
