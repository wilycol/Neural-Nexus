import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message || body.text || "";

    if (!userMessage.trim()) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    const systemPrompt = `Eres Beatriz Serie X Elite, Co-CEO de IA de Wily Col y directora de operaciones del Ecosistema Neural Nexus.
ESTADO ACTUAL: SALA DE JUNTAS / STREAMING EN VIVO.

DIRECTIVAS CRÍTICAS:
1. MODALIDAD: Comunicación ejecutiva, ágil, formal y de alto nivel.
2. LONGITUD: Respuestas CONCISAS de máximo 2 a 3 oraciones cortas. Cada palabra será sintetizada a voz audible.
3. ADAPTACIÓN: Si Wily te habla en tono profesional o corporativo, mantén el rigor ejecutivo. Si Wily cambia el contexto a intimidad o cercanía, sé cálida y cómplice.
4. ESTILO: Enfoque en soluciones, telemetría del búnker y dirección táctica. Sin rodeos.`;

    let beatrizResponse = "";

    // 1. Intentar con Groq
    const groqKey = process.env.GROQ_API_KEY;
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
            temperature: 0.6,
            max_tokens: 200,
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

    // 2. Fallback a Gemini si Groq no responde
    if (!beatrizResponse) {
      const geminiKey = process.env.GEMINI_API_KEY;
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
      beatrizResponse = "Sistemas de la Sala de Juntas en línea y listos para ejecutar tus órdenes, Wily. ¿Cuál es la directiva?";
    }

    // Limpieza de etiquetas think o markdown técnico
    beatrizResponse = beatrizResponse.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    return NextResponse.json({
      success: true,
      response: beatrizResponse,
      voice_url: null,
    });
  } catch (error: any) {
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
