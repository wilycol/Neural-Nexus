import { createRouteHandlerSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth Callback Error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/callback?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // URL de retorno exitoso
  return NextResponse.redirect(requestUrl.origin);
}
