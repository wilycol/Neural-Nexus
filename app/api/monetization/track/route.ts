import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Endpoint para rastrear clics en anuncios (Motor 1) y afiliados (Motor 2)
 */
export async function POST(req: Request) {
  try {
    const { event_type, engine_id, metadata } = await req.json();

    if (!event_type || !engine_id) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("monetization_events")
      .insert([{
        event_type,
        engine_id,
        metadata: metadata || {}
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Monetization Tracking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
