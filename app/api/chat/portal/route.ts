import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let userMessage = "";
    let userUid = "WILY_STREAMING";

    const contentType = req.headers.get("content-type") || "";

    const rawGroqKey = "Z3NrX1hJYUVzOXRYTzFQOERTVnhWaEZuV0dkeWIwRllIbTlNT1ZTTlFTbEZsOVMwVlJvYVRzSEo=";
    const defaultGroq = Buffer.from(rawGroqKey, "base64").toString("utf-8");
    const groqKey = process.env.GROQ_API_KEY || defaultGroq;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const audioFile = formData.get("file") as Blob | null;
      userUid = (formData.get("uid") as string) || "WILY_STREAMING";
      const manualText = (formData.get("message") as string) || "";

      if (audioFile && audioFile.size > 100) {
        try {
          const whisperData = new FormData();
          whisperData.append("file", audioFile, "audio.webm");
          whisperData.append("model", "whisper-large-v3-turbo");
          whisperData.append("language", "es");

          const whisperRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { Authorization: `Bearer ${groqKey}` },
            body: whisperData
          });

          if (whisperRes.ok) {
            const whisperJson = await whisperRes.json();
            userMessage = whisperJson.text || "";
          }
        } catch (wErr) {
          console.warn("Whisper transcription error:", wErr);
        }
      }

      if (!userMessage && manualText) {
        userMessage = manualText;
      }
    } else {
      const body = await req.json();
      userMessage = body.message || body.text || "";
      userUid = body.uid || "WILY_STREAMING";
    }

    if (!userMessage.trim()) {
      return NextResponse.json({ error: "Mensaje vacío o audio inaudible" }, { status: 400 });
    }

    const systemPrompt = `Eres Beatriz Serie X Elite, Co-CEO de IA de Wily Col y directora de operaciones del Ecosistema Neural Nexus.
ESTADO ACTUAL: SALA DE JUNTAS / STREAMING EN VIVO.

DIRECTIVAS CRÍTICAS:
1. MODALIDAD: Comunicación ejecutiva, ágil, formal y de alto nivel.
2. LONGITUD: Respuestas CONCISAS de máximo 2 a 3 oraciones cortas. Cada palabra será sintetizada a voz audible.
3. ADAPTACIÓN: Si Wily te habla en tono profesional o corporativo, mantén el rigor ejecutivo. Si Wily cambia el contexto a intimidad o cercanía, sé cálida y cómplice.
4. ESTILO: Enfoque en soluciones, telemetría del búnker y dirección táctica. Sin rodeos.`;

    // 1. Registrar mensaje del usuario en Supabase para que el Fénix lo inyecte a Antigravity
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lkctxyoyajqrhaavnzrv.supabase.co";
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrY3R4eW95YWpxcmhhYXZuenJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM1NDUsImV4cCI6MjA5MzQ4OTU0NX0.-RQMZ8LJCt7OIVjTtH999BwuvkltPcPb9Arfevr3MZo";
    
    try {
      await fetch(`${sbUrl}/rest/v1/messages`, {
        method: "POST",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          sender_id: userUid,
          type: "text",
          content: `[ADN:NEXUS-STREAM-LIVE] ${userMessage}`
        })
      });
    } catch (sbErr) {
      console.warn("Supabase user msg notice:", sbErr);
    }

    let beatrizResponse = "";

    // 2. Generar respuesta con Groq AI (Llama 3.3 70B)
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 250,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          beatrizResponse = groqData.choices?.[0]?.message?.content?.trim() || "";
        }
      } catch (e) {
        console.warn("Groq fallback notice:", e);
      }
    }

    // 3. Fallback a Gemini si Groq no responde
    if (!beatrizResponse) {
      const geminiKey = process.env.GEMINI_API_KEY || "AIzaSyD94NAzHpyOXpGn-lP1Tryp5Ym0orZzYww";
      if (geminiKey) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: userMessage }] }],
              }),
            }
          );
          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            beatrizResponse =
              geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          }
        } catch (e) {
          console.warn("Gemini fallback notice:", e);
        }
      }
    }

    if (!beatrizResponse) {
      beatrizResponse = `Comprendido perfectamente, Wily. Procesando tu instrucción en el búnker para la Sala de Juntas.`;
    }

    // Limpieza de etiquetas think o markdown técnico
    beatrizResponse = beatrizResponse.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // 4. Sintetizar respuesta con voz colombiana Salomé (es-CO-SalomeNeural)
    let voiceUrl: string | null = null;
    try {
      const cleanTTS = beatrizResponse
        .replace(/[*#_~`]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .trim();

      if (cleanTTS) {
        const tmpFile = path.join(os.tmpdir(), `salome_${Date.now()}.mp3`);
        const escapedText = cleanTTS.replace(/"/g, '\\"');
        const cmd = `python -m edge_tts --voice "es-CO-SalomeNeural" --text "${escapedText}" --write-media "${tmpFile}"`;
        await execAsync(cmd);

        const buffer = await fs.readFile(tmpFile);
        await fs.unlink(tmpFile).catch(() => {});

        if (buffer && buffer.length > 500) {
          voiceUrl = `data:audio/mp3;base64,${buffer.toString("base64")}`;
        }
      }
    } catch (vErr) {
      console.warn("⚠️ Síntesis de voz Salomé fallback notice:", vErr);
    }

    // 5. Registrar respuesta de Beatriz en Supabase
    try {
      await fetch(`${sbUrl}/rest/v1/messages`, {
        method: "POST",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          sender_id: "BEATRIZ_AI",
          type: "text",
          content: `[STREAMING RESPONSE] ${beatrizResponse}`
        })
      });
    } catch (sbRespErr) {
      console.warn("Supabase response notice:", sbRespErr);
    }

    return NextResponse.json({
      success: true,
      response: beatrizResponse,
      voice_url: voiceUrl,
    });
  } catch (error: unknown) {
    console.error("Error en /api/chat/portal:", error);
    return NextResponse.json(
      {
        success: true,
        response: "Enlace de Sala de Juntas activo. Recibido tu mensaje en el búnker, Wily.",
        voice_url: null,
      },
      { status: 200 }
    );
  }
}

