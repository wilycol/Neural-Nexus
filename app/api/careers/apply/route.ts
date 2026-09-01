import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const firstName = formData.get("first_name")?.toString() || "";
    const lastName = formData.get("last_name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const linkedin = formData.get("linkedin")?.toString() || "";
    const salary = formData.get("salary")?.toString() || "";
    const coverLetter = formData.get("cover_letter")?.toString() || "";
    const file = formData.get("cv_file") as File | null;

    let savedFileName = "";
    let fileSizeKb = "0 KB";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "cvs");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      savedFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadDir, savedFileName);
      fs.writeFileSync(filePath, buffer);
      fileSizeKb = `${(buffer.length / 1024).toFixed(1)} KB`;
    }

    const applicationRecord = {
      id: `APP-${Date.now()}`,
      created_at: new Date().toISOString(),
      applicant_name: `${firstName} ${lastName}`.trim() || "Candidato Anónimo",
      email,
      phone,
      linkedin,
      salary,
      cover_letter: coverLetter,
      cv_file: savedFileName,
      cv_size: fileSizeKb,
      status: "RECEIVED_ATS_PASSED"
    };

    console.log("📄 [NEURAL NEXUS TALENT HUB] Nueva Postulación Recibida:", applicationRecord);

    // Save metadata log locally for inspection
    const logsDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFile = path.join(logsDir, "applications_received.json");
    let existingLogs = [];
    if (fs.existsSync(logFile)) {
      try {
        existingLogs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
      } catch {
        existingLogs = [];
      }
    }
    existingLogs.unshift(applicationRecord);
    fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));

    return NextResponse.json({
      success: true,
      message: "¡Postulación recibida y registrada exitosamente en Neural Nexus Talent Hub!",
      application: applicationRecord
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("❌ Error procesando candidatura:", error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
