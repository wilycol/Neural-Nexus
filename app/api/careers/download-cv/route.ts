import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json({ error: "Nombre de archivo requerido" }, { status: 400 });
    }

    const safeName = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", "cvs", safeName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Archivo CV no encontrado" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}"`
      }
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error al descargar CV";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
