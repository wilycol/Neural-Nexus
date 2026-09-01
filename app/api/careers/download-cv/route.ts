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

    // 2. Si no existe en disco (Serverless Vercel), buscar cv_base64 en Supabase
    const supabase = getSupabaseHiveClient();
    if (supabase) {
      const { data } = await supabase
        .from("candidate_applications")
        .select("cv_base64")
        .eq("cv_file", filename)
        .single();

      if (data && data.cv_base64 && data.cv_base64 !== "PRESENT") {
        const fileBuffer = Buffer.from(data.cv_base64, "base64");
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${safeName}"`
          }
        });
      }
    }

    return NextResponse.json({ error: "Archivo CV no encontrado en disco ni en base de datos" }, { status: 404 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error al descargar CV";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
