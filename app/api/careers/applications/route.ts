import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";

export async function GET() {
  try {
    let applications: Record<string, unknown>[] = [];

    // 1. Intentar consultar desde Supabase Hive
    const supabase = getSupabaseHiveClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("candidate_applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          applications = data as Record<string, unknown>[];
        }
      } catch (sbErr) {
        console.warn("Aviso consulta Supabase applications:", sbErr);
      }
    }

    // 2. Si no hay registros en Supabase, consultar log local JSON
    if (applications.length === 0) {
      const logFile = path.join(process.cwd(), "data", "applications_received.json");
      if (fs.existsSync(logFile)) {
        try {
          applications = JSON.parse(fs.readFileSync(logFile, "utf-8"));
        } catch {
          applications = [];
        }
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
