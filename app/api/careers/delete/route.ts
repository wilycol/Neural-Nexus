import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de candidatura requerido" }, { status: 400 });
    }

    console.log("🗑️ [NEURAL NEXUS ATS] Eliminando candidatura ID:", id);

    const supabase = getSupabaseHiveClient();
    if (supabase) {
      // 1. Borrar de candidate_applications por eq(id) y like(id)
      try {
        await supabase.from("candidate_applications").delete().eq("id", id);
        await supabase.from("candidate_applications").delete().like("id", `%${id}%`);
      } catch (err) {
        console.warn("Aviso borrado candidate_applications:", err);
      }

      // 2. Borrar de partnership_leads conteniendo el id en company
      try {
        await supabase.from("partnership_leads").delete().like("company", `%${id}%`);
      } catch (err) {
        console.warn("Aviso borrado partnership_leads:", err);
      }

      // 3. Borrar de partnership_leads si id es un número de fila
      const cleanNum = id.replace("APP-", "");
      if (/^\d+$/.test(cleanNum)) {
        try {
          const numVal = parseInt(cleanNum, 10);
          await supabase.from("partnership_leads").delete().eq("id", numVal);
        } catch {
          // omit
        }
      }
    }

    // 3. Borrar de log local JSON si existe
    try {
      const logFile = path.join(process.cwd(), "data", "applications_received.json");
      if (fs.existsSync(logFile)) {
        let logs: Array<{ id: string }> = [];
        try {
          logs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
        } catch {
          logs = [];
        }
        const filteredLogs = logs.filter((item) => item.id !== id);
        fs.writeFileSync(logFile, JSON.stringify(filteredLogs, null, 2));
      }
    } catch (fsErr) {
      console.warn("Aviso borrado local JSON:", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: `Candidatura ${id} eliminada exitosamente del sistema`
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error al eliminar candidatura";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
