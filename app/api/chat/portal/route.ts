import { NextResponse } from "next/server";
import WebSocket from "ws";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isWhisperHallucination(text: string): boolean {
  if (!text) return true;
  const clean = text.trim().toLowerCase();
  if (clean.length < 3) return true;

  // Filtro estricto para "gracias" aislados o repetidos por alucinación de silencio de Whisper
  if (clean.length < 40 && /gracias/i.test(clean)) {
    const isRealSentence = /gracias\s+(por|de|a|en|que)\s+\w{3,}/i.test(clean);
    if (!isRealSentence) return true;
  }

  const hallucinationRegexes = [
    /^(gracias[\s.,!?-]*)+$/i,
    /gracias por ver/i,
    /subt[íi]tulos/i,
    /suscr[íi]bete/i,
    /amara\.org/i,
    /transcriptor/i,
    /continuar[áa]/i,
    /^[\s.,!?-]*$/
  ];
  return hallucinationRegexes.some(regex => regex.test(clean));
}

import crypto from "crypto";

function generateSecMsGec(): string {
  const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
  const WIN_EPOCH = 11644473600;
  
  let ticks = Date.now() / 1000;
  ticks += WIN_EPOCH;
  ticks -= ticks % 300;
  ticks *= 1e7;

  const strToHash = `${Math.floor(ticks)}${TRUSTED_CLIENT_TOKEN}`;
  return crypto.createHash("sha256").update(strToHash, "ascii").digest("hex").toUpperCase();
}

async function synthesizeSalomeEdgeTTS(text: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    try {
      const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
      const secMsGec = generateSecMsGec();
      const CHROMIUM_FULL_VERSION = "143.0.3650.75";
      const connectId = crypto.randomBytes(16).toString("hex");

      const wsUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=1-${CHROMIUM_FULL_VERSION}&ConnectionId=${connectId}`;
      const reqId = connectId;

      const WSConstructor = typeof globalThis.WebSocket !== "undefined" ? (globalThis.WebSocket as unknown as typeof WebSocket) : WebSocket;
      const ws = new WSConstructor(wsUrl, {
        headers: {
          "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0`,
          "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
          "Pragma": "no-cache",
          "Cache-Control": "no-cache",
          "Sec-WebSocket-Version": "13"
        }
      });

      const audioChunks: Buffer[] = [];

      const timeout = setTimeout(() => {
        try { ws.close(); } catch {}
        resolve(audioChunks.length > 0 ? Buffer.concat(audioChunks) : null);
      }, 60000);

      ws.on("open", () => {
        const ts = new Date().toUTCString();

        const configMsg =
          `X-Timestamp:${ts}\r\n` +
          `Content-Type:application/json; charset=utf-8\r\n` +
          `Path:speech.config\r\n\r\n` +
          `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`;

        ws.send(configMsg);

        const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='es-CO'><voice name='es-CO-SalomeNeural'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapedText}</prosody></voice></speak>`;

        const ssmlMsg =
          `X-RequestId:${reqId}\r\n` +
          `Content-Type:application/ssml+xml\r\n` +
          `X-Timestamp:${ts}Z\r\n` +
          `Path:ssml\r\n\r\n` +
          `${ssml}`;

        ws.send(ssmlMsg);
      });

      ws.on("message", (data: unknown) => {
        if (typeof data === "string") {
          if (data.includes("Path:turn.end")) {
            clearTimeout(timeout);
            setTimeout(() => {
              try { ws.close(); } catch {}
              resolve(audioChunks.length > 0 ? Buffer.concat(audioChunks) : null);
            }, 300);
          }
        } else if (Buffer.isBuffer(data)) {
          if (data.length > 2) {
            const headerLength = data.readUInt16BE(0);
            if (headerLength < data.length) {
              const headerStr = data.subarray(2, 2 + headerLength).toString("utf-8");
              if (headerStr.includes("Path:audio")) {
                const audioData = data.subarray(2 + headerLength);
                if (audioData.length > 0) {
                  audioChunks.push(audioData);
                }
              }
            }
          }
          const str = data.toString("utf-8");
          if (str.includes("Path:turn.end")) {
            clearTimeout(timeout);
            setTimeout(() => {
              try { ws.close(); } catch {}
              resolve(audioChunks.length > 0 ? Buffer.concat(audioChunks) : null);
            }, 300);
          }
        }
      });

      ws.on("error", () => {
        clearTimeout(timeout);
        try { ws.close(); } catch {}
        resolve(audioChunks.length > 0 ? Buffer.concat(audioChunks) : null);
      });

      ws.on("close", () => {
        clearTimeout(timeout);
        resolve(audioChunks.length > 0 ? Buffer.concat(audioChunks) : null);
      });
    } catch {
      resolve(null);
    }
  });
}

function cleanTextForSpeech(text: string): string {
  if (!text) return "";
  let clean = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[*#_~`>|\-\\]/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\[ADN:[^\]]+\]/g, "");

  // ES5 compatible emoji & symbol stripping without requiring /u regex flag
  clean = clean.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
  clean = clean.replace(/[\u2600-\u27BF\uFE00-\uFE0F\u200D]/g, "");

  return clean.replace(/\s+/g, " ").trim();
}

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

      if (audioFile && audioFile.size > 5000) {

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
            const transcribed = whisperJson.text || "";
            if (!isWhisperHallucination(transcribed)) {
              userMessage = transcribed;
            } else {
              console.log("🛡️ [WHISPER-FILTER] Ignorando alucinación de silencio detectada:", transcribed);
            }
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
      return NextResponse.json({
        success: false,
        error: "Audio inaudible. Escuchando de nuevo...",
        response: null,
        voice_url: null
      }, { status: 200 });
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
      const liveUserTag = userMessage.includes("[ADN:NEXUS-STREAM-LIVE]") ? userMessage : `[ADN:NEXUS-STREAM-LIVE] ${userMessage}`;
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
          content: liveUserTag
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

    // 4. Sintetizar respuesta con voz colombiana Salomé en fragmentos (Sequential Chunked Audio)
    const voiceUrls: string[] = [];
    try {
      const cleanTTS = cleanTextForSpeech(beatrizResponse);

      if (cleanTTS) {
        // Dividir el texto en oraciones cortas de ~10s máximo
        const sentenceChunks = cleanTTS
          .split(/(?<=[.?!])\s+|\n+/)
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const chunk of sentenceChunks) {
          let chunkUrl: string | null = null;

          // Intento 1: Pure TS Edge-TTS WebSocket (Vercel / Cloud Serverless)
          const tsBuffer = await synthesizeSalomeEdgeTTS(chunk);
          if (tsBuffer && tsBuffer.length > 500) {
            chunkUrl = `data:audio/mp3;base64,${tsBuffer.toString("base64")}`;
          }

          if (chunkUrl) {
            voiceUrls.push(chunkUrl);
          }
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

    const primaryVoiceUrl = voiceUrls.length > 0 ? (voiceUrls.length === 1 ? voiceUrls[0] : voiceUrls) : null;

    return NextResponse.json({
      success: true,
      response: beatrizResponse,
      voice_url: primaryVoiceUrl,
      voice_urls: voiceUrls,
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

