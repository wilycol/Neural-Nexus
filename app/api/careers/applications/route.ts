import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

        // Fuente A: Tabla dedicada candidate_applications
        const { data: candData } = await supabase
          .from("candidate_applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (candData && candData.length > 0) {
          for (const item of candData) {
            const appId = (item.id as string) || `APP-${Date.now()}`;
            if (!seenIds.has(appId)) {
              seenIds.add(appId);
              fetchedApps.push(item as Record<string, unknown>);
            }
          }
        }

        // Fuente B: Respaldo en partnership_leads (company empieza por ATS_CANDIDATE:)
        const { data: leadData } = await supabase
          .from("partnership_leads")
          .select("*")
          .like("company", "ATS_CANDIDATE:%")
          .order("created_at", { ascending: false });

        if (leadData && leadData.length > 0) {
          for (const l of leadData) {
            const appId = l.company ? l.company.replace("ATS_CANDIDATE:", "") : `APP-${l.id}`;
            if (!seenIds.has(appId)) {
              seenIds.add(appId);
              let parsedMsg: Record<string, string> = {};
              try {
                if (l.message) parsedMsg = JSON.parse(l.message);
              } catch {
                parsedMsg = {};
              }
              fetchedApps.push({
                id: appId,
                created_at: l.created_at,
                applicant_name: l.name,
                email: l.email,
                phone: l.phone,
                linkedin: parsedMsg.linkedin || "",
                salary: parsedMsg.salary || "",
                cover_letter: parsedMsg.cover_letter || "",
                cv_file: parsedMsg.cv_file || "",
                cv_size: parsedMsg.cv_size || "",
                cv_base64: parsedMsg.cv_base64 || "",
                status: "RECEIVED_ATS_PASSED"
              });
            }
          }
        }

        applications = fetchedApps;
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
