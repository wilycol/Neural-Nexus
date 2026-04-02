import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Usar createMiddlewareClient específico para Middleware
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Esto sincroniza la sesión y refresca las cookies si es necesario
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
