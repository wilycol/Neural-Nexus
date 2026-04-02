import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "3");

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("news")
      .select("id, title, created_at, content_type, video_url, is_short, is_reusable, has_audio, has_subtitles, author_id")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Industrial Debug: Latest Beatriz V5 Receptions",
      count: data?.length || 0,
      data: data
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
