import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const logFile = path.join(process.cwd(), "data", "applications_received.json");
    let applications = [];

    if (fs.existsSync(logFile)) {
      try {
        applications = JSON.parse(fs.readFileSync(logFile, "utf-8"));
      } catch {
        applications = [];
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
