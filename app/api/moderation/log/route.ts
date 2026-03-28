import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ status: "no_supabase" }, { status: 200 });
    }
    const cookieStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
      },
    }) as unknown as {
      from: (table: string) => {
        insert: (values: Record<string, unknown>) => Promise<{ error: unknown | null }>;
      };
    };
    const body = await request.json().catch(() => null);
    const commentId = typeof body?.comment_id === "string" ? body.comment_id : null;
    const moderatorId = typeof body?.moderator_id === "string" ? body.moderator_id : null;
    const reason = typeof body?.reason === "string" ? body.reason : "";
    if (!commentId) {
      return NextResponse.json({ error: "Falta comment_id" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("moderation_logs")
      .insert({ comment_id: commentId, moderator_id: moderatorId, reason, created_at: now });
    if (error) {
      return NextResponse.json({ status: "no_table" }, { status: 200 });
    }
    return NextResponse.json({ status: "ok" }, { status: 201 });
  } catch {
    return NextResponse.json({ status: "noop" }, { status: 200 });
  }
}
