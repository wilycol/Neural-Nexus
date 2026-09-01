import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json({ error: "Nombre de archivo requerido" }, { status: 400 });
    }

    const safeName = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", "cvs", safeName);

    // 1. Si existe en el sistema de archivos local
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}"`
        }
      });
    }

    // 2. Buscar cv_base64 en Supabase (candidate_applications o messages)
    const supabase = getSupabaseHiveClient();
    if (supabase) {
      // Intento 1: candidate_applications
      const { data } = await supabase
        .from("candidate_applications")
        .select("cv_base64")
        .eq("cv_file", filename)
        .single();

      if (data && data.cv_base64 && data.cv_base64.length > 20) {
        const fileBuffer = Buffer.from(data.cv_base64, "base64");
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${safeName}"`
          }
        });
      }

      // Intento 2: messages table fallback
      const { data: msgData } = await supabase
        .from("messages")
        .select("content")
        .eq("type", "candidate_application")
        .order("created_at", { ascending: false });

      if (msgData) {
        for (const m of msgData) {
          try {
            if (m.content) {
              const parsed = JSON.parse(m.content);
              if (parsed.cv_file === filename && parsed.cv_base64 && parsed.cv_base64.length > 20) {
                const fileBuffer = Buffer.from(parsed.cv_base64, "base64");
                return new NextResponse(fileBuffer, {
                  headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${safeName}"`
                  }
                });
              }
            }
          } catch {
            // omit
          }
        }
      }
    }

    return NextResponse.json({ error: "Archivo CV no encontrado en disco ni en base de datos" }, { status: 404 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error al descargar CV";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
