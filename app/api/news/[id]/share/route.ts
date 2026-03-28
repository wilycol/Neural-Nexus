import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";

const createSupabaseRouteClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase no está configurado");
  }

  const cookieStore = cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
    },
  });
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = params.id;
    const supabase = createSupabaseRouteClient();
    const { data } = await supabase.auth.getUser();
    const authUser = data.user;
    if (!authUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const platform = body?.platform;
    if (
      platform !== "copy" &&
      platform !== "x" &&
      platform !== "whatsapp" &&
      platform !== "telegram" &&
      platform !== "facebook" &&
      platform !== "linkedin"
    ) {
      return NextResponse.json({ error: "Plataforma inválida" }, { status: 400 });
    }

    // Registrar el share
    const { error: shareError } = await supabase
      .from("shares")
      .insert({
        user_id: authUser.id,
        news_id: newsId,
        platform,
        created_at: new Date().toISOString(),
      });

    if (shareError) {
      console.error("Error registering share:", shareError);
    }

    const { data: userRow } = await supabase
      .from("users")
      .select("share_count")
      .eq("id", authUser.id)
      .maybeSingle();

    await supabase
      .from("users")
      .update({ share_count: (userRow?.share_count || 0) + 1 })
      .eq("id", authUser.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in share:", error);
    return NextResponse.json(
      { error: "Error al registrar share" },
      { status: 500 }
    );
  }
}
