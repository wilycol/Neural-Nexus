import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // 1. Verificar sesión
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Verificar rol de administrador
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || user?.role !== 'admin') {
      return NextResponse.json({ error: "Prohibido: Solo administradores" }, { status: 403 });
    }

    // 3. Obtener estadísticas mensuales
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .rpc('get_monthly_stats')
      .single();

    if (error) {
      console.error('Error fetching monthly stats:', error);
      return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error in monthly stats API:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
