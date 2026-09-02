import { NextResponse } from "next/server";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";

export async function GET() {
  try {
    let applications: Record<string, unknown>[] = [];

    // 1. Consultar desde Supabase Hive
    const supabase = getSupabaseHiveClient();
    if (supabase) {
      try {
        const fetchedApps: Record<string, unknown>[] = [];
        const seenIds = new Set<string>();

        // Tabla dedicada candidate_applications
        const { data: candData } = await supabase
          .from("candidate_applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (candData) {
          applications = candData as Record<string, unknown>[];
        }
      } catch (sbErr) {
        console.warn("Aviso consulta Supabase candidate_applications:", sbErr);
      }
    }



    return NextResponse.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error al obtener candidaturas";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
