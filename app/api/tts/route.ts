import { NextResponse } from "next/server";
import crypto from "crypto";
import WebSocket from "ws";

export const dynamic = "force-dynamic";

function cleanTextForSpeech(text: string): string {
  if (!text) return "";
  let clean = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[*#_~`>|\-\\]/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\[ADN:[^\]]+\]/g, "");

  clean = clean.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
  clean = clean.replace(/[\u2600-\u27BF\uFE00-\uFE0F\u200D]/g, "");

  return clean.replace(/\s+/g, " ").trim();
}

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
      }, 25000);

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
            try { ws.close(); } catch {}
            resolve(audioChunks.length > 0 ? Buffer.concat(audioChunks) : null);
          }
        } else if (Buffer.isBuffer(data)) {
          const str = data.toString("utf-8");
          if (str.includes("Path:turn.end")) {
            clearTimeout(timeout);
            try { ws.close(); } catch {}
            resolve(audioChunks.length > 0 ? Buffer.concat(audioChunks) : null);
          } else if (data.length > 2) {
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

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text missing" }, { status: 400 });
    }
    const cleanTTS = cleanTextForSpeech(text);
    if (!cleanTTS) {
      return NextResponse.json({ voice_url: null });
    }
    const tsBuffer = await synthesizeSalomeEdgeTTS(cleanTTS);
    if (tsBuffer && tsBuffer.length > 500) {
      const voiceUrl = `data:audio/mp3;base64,${tsBuffer.toString("base64")}`;
      return NextResponse.json({ voice_url: voiceUrl });
    }
    return NextResponse.json({ voice_url: null });
  } catch (err) {
    return NextResponse.json({ voice_url: null });
  }
}
