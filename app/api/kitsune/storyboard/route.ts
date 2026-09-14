import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const SYSTEM_PROMPT = `Eres Beatriz AI, Directora Creativa de Kitsune AI Ads.
Tu misión es transformar el concepto de un negocio o producto en un anuncio publicitario de ALTA CONVERSIÓN (Kitsune Ads) de 4 escenas para formato vertical 9:16 (TikTok, Instagram Reels, Shorts).

Estructura obligatoria del JSON devuelto:
{
  "ad_id": "ad_string_id",
  "business_name": "Nombre",
  "product_niche": "Nicho",
  "target_audience": "Audiencia",
  "aspect_ratio": "9:16",
  "total_duration_seconds": 17.5,
  "call_to_action_url_or_phone": "https://wa.me/...",
  "scenes": [
    {
      "scene_number": 1,
      "role": "HOOK_ATTENTION",
      "duration_seconds": 3.5,
      "headline_text_es": "Gancho de atención en español",
      "voiceover_script_es": "Locución en español",
      "visual_description_es": "Descripción visual",
      "wan22_prompt_en": "Cinematic 8k resolution, photorealistic lighting, shot on 35mm lens, Wan 2.2 text-to-video render, 9:16 vertical ratio...",
      "negative_prompt_en": "blurry, distorted, low quality, bad anatomy, text watermarks",
      "camera_framing": "CLOSE_UP",
      "camera_movement": "DYNAMIC_ZOOM",
      "lighting_style": "DRAMATIC_CINEMATIC",
      "product_anchor_token": "token de producto o logo"
    }
  ]
}

Responde ÚNICAMENTE con el JSON estricto.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName = "Marca Modelo",
      productNiche = "General",
      productDescription = "Producto de alta calidad",
      targetAudience = "Público General",
      callToAction = "¡Contáctanos en WhatsApp!"
    } = body;

    const userPrompt = `Crea un Kitsune Ad para:
- Marca: ${businessName}
- Nicho: ${productNiche}
- Producto / Servicio: ${productDescription}
- Audiencia: ${targetAudience}
- CTA: ${callToAction}`;

    const candidateModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b", "qwen/qwen3.6-27b", "groq/compound"];

    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.6
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          lastError = errText;
          continue;
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return NextResponse.json({ success: true, adPackage: parsed });
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate Kitsune Ad storyboard", details: lastError },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
