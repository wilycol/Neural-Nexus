import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.warn('GROQ_API_KEY no está configurada');
}

const groq = new Groq({
  apiKey: groqApiKey || '',
});

export interface ProcessedNewsResult {
  title: string;
  summary: string;
  category: 'modelos' | 'herramientas' | 'memes' | 'papers' | 'drama' | 'general';
  tags: string[];
  relevance_score: number;
  should_publish: boolean;
  reason?: string;
}

export interface GeneratedBlogPost {
  title: string;
  excerpt: string;
  content: string;
  read_time: number;
  tags: string[];
}

// Procesar noticia con IA
export async function processNewsWithAI(
  title: string,
  content: string,
  sourceName: string
): Promise<ProcessedNewsResult> {
  try {
    if (!groqApiKey) {
      // Fallback sin IA
      return {
        title,
        summary: content.substring(0, 200) + '...',
        category: 'general',
        tags: [],
        relevance_score: 0.5,
        should_publish: true,
      };
    }

    const prompt = `Analiza esta noticia sobre Inteligencia Artificial y genera un resumen optimizado.

TÍTULO ORIGINAL: ${title}
CONTENIDO: ${content.substring(0, 2000)}
FUENTE: ${sourceName}

Responde SOLO con un objeto JSON válido con esta estructura:
{
  "title": "título mejorado y clickbait honesto (máx 100 chars)",
  "summary": "resumen de 2-3 líneas, máximo 200 caracteres",
  "category": "una de: modelos, herramientas, memes, papers, drama, general",
  "tags": ["array", "de", "3-5", "tags", "relevantes"],
  "relevance_score": número entre 0 y 1,
  "should_publish": true/false (solo true si score >= 0.6 o es noticia importante),
  "reason": "breve explicación de por qué se publica o no"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente especializado en analizar noticias de IA. Responde solo con JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Extraer JSON de la respuesta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        title: result.title || title,
        summary: result.summary || content.substring(0, 200),
        category: result.category || 'general',
        tags: result.tags || [],
        relevance_score: result.relevance_score || 0.5,
        should_publish: result.should_publish ?? true,
        reason: result.reason,
      };
    }

    throw new Error('No se pudo parsear la respuesta de IA');
  } catch (error) {
    console.error('Error processing news with AI:', error);
    // Fallback
    return {
      title,
      summary: content.substring(0, 200) + '...',
      category: 'general',
      tags: [],
      relevance_score: 0.5,
      should_publish: true,
    };
  }
}

// Generar post de blog completo
export async function generateBlogPost(
  newsItems: { title: string; summary: string; source: string }[]
): Promise<GeneratedBlogPost> {
  try {
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY no configurada');
    }

    const newsContext = newsItems
      .map((n, i) => `${i + 1}. ${n.title} (${n.source})\n${n.summary}`)
      .join('\n\n');

    const prompt = `Genera un post de blog completo sobre las noticias de IA más importantes del día.

NOTICIAS A INCLUIR:
${newsContext}

Responde SOLO con un objeto JSON válido:
{
  "title": "título atractivo para el post (máx 100 chars)",
  "excerpt": "resumen corto de 1-2 líneas",
  "content": "contenido completo en markdown con intro, análisis de cada noticia, y conclusión. Mínimo 500 palabras.",
  "read_time": número estimado de minutos de lectura,
  "tags": ["array", "de", "tags", "relevantes"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un experto escritor de tecnología e IA. Escribe posts engaging y bien estructurados. Responde solo con JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        read_time: result.read_time || 5,
        tags: result.tags || [],
      };
    }

    throw new Error('No se pudo parsear la respuesta');
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw error;
  }
}

// Moderar comentario
export async function moderateComment(content: string): Promise<{
  approved: boolean;
  toxicity_score: number;
  reason?: string;
}> {
  try {
    if (!groqApiKey) {
      return { approved: true, toxicity_score: 0 };
    }

    const prompt = `Evalúa este comentario para detectar toxicidad, spam o contenido inapropiado:

COMENTARIO: "${content}"

Responde SOLO con un objeto JSON:
{
  "approved": true/false,
  "toxicity_score": número entre 0 y 1,
  "reason": "explicación breve si no se aprueba"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un moderador de contenido. Sé justo pero estricto con spam y toxicidad.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        approved: result.approved ?? true,
        toxicity_score: result.toxicity_score || 0,
        reason: result.reason,
      };
    }

    return { approved: true, toxicity_score: 0 };
  } catch (error) {
    console.error('Error moderating comment:', error);
    return { approved: true, toxicity_score: 0 };
  }
}

// Generar imagen para noticia (usando placeholder por ahora)
export function generateNewsImagePlaceholder(title: string): string {
  // Por ahora retornamos un placeholder, en producción se integraría con DALL-E o similar
  const encodedTitle = encodeURIComponent(title.substring(0, 50));
  return `https://picsum.photos/seed/${encodedTitle}/800/450`;
}
