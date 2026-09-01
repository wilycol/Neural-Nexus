import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";

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
    let cvBase64 = "";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      cvBase64 = buffer.toString("base64");
      savedFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      fileSizeKb = `${(buffer.length / 1024).toFixed(1)} KB`;

      // Save locally if filesystem writable
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "cvs");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, savedFileName);
        fs.writeFileSync(filePath, buffer);
      } catch (fsErr) {
        console.warn("Aviso filesystem local no escribible:", fsErr);
      }
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
      cv_base64: cvBase64,
      status: "RECEIVED_ATS_PASSED"
    };

    console.log("📄 [NEURAL NEXUS TALENT HUB] Nueva Postulación Recibida:", applicationRecord.applicant_name);

    // 1. Guardar en Supabase Hive EXCLUSIVAMENTE en tabla candidate_applications / partnership_leads (NUNCA en messages)
    const supabase = getSupabaseHiveClient();
    if (supabase) {
      try {
        // Guardar en candidate_applications
        const { error: candErr } = await supabase.from("candidate_applications").insert({
          id: applicationRecord.id,
          applicant_name: applicationRecord.applicant_name,
          email: applicationRecord.email,
          phone: applicationRecord.phone,
          linkedin: applicationRecord.linkedin,
          salary: applicationRecord.salary,
          cover_letter: applicationRecord.cover_letter,
          cv_file: applicationRecord.cv_file,
          cv_size: applicationRecord.cv_size,
          cv_base64: applicationRecord.cv_base64,
          status: applicationRecord.status
        });

        if (candErr) {
          console.warn("Aviso inserción candidate_applications:", candErr.message);
          // Respaldo en partnership_leads (sin detonar el bridge de mensajes)
          await supabase.from("partnership_leads").insert({
            name: applicationRecord.applicant_name,
            email: applicationRecord.email,
            phone: applicationRecord.phone,
            company: `ATS_CANDIDATE:${applicationRecord.id}`,
            message: JSON.stringify({
              salary: applicationRecord.salary,
              linkedin: applicationRecord.linkedin,
              cover_letter: applicationRecord.cover_letter,
              cv_file: applicationRecord.cv_file,
              cv_size: applicationRecord.cv_size,
              cv_base64: applicationRecord.cv_base64
            })
          });
        }
      } catch (errSb) {
        console.warn("Error enviando candidatura a Supabase:", errSb);
      }
    }

    // 2. Guardar en log local JSON
    try {
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
    } catch (fsLogErr) {
      console.warn("Aviso guardado local JSON:", fsLogErr);
    }

    return NextResponse.json({
      success: true,
      message: "¡Postulación recibida y registrada exitosamente en Neural Nexus Talent Hub!",
      application: {
        id: applicationRecord.id,
        applicant_name: applicationRecord.applicant_name,
        email: applicationRecord.email,
        phone: applicationRecord.phone,
        cv_file: applicationRecord.cv_file,
        cv_size: applicationRecord.cv_size,
        status: applicationRecord.status
      }
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
