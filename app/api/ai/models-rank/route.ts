import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { category } = await req.json();
    
    const systemPrompt = `Eres un experto analista industrial de IA. Tu misión es generar un ranking técnico y audaz de los 8 mejores modelos actuales para la categoría: ${category}.
    
    REGLA DE ORO: Utiliza datos actualizados de benchmarks (MMLU, HumanEval, etc.) y tendencias del mercado 2024-2025.
    
    Estructura de respuesta: Devuelve exclusivamente un objeto JSON con una propiedad "modelos" que sea un array de objetos.
    Cada objeto debe tener:
    - id: (número único)
    - nombre: (ej: GPT-4o, Llama 3.3, Claude 3.5 Sonnet)
    - empresa: (ej: OpenAI, Meta, Anthropic)
    - descripcion: (una frase audaz sobre su capacidad)
    - metrica_principal: (ej: Contexto, Razonamiento, Latencia)
    - puntaje: (0-100)
    - razonamiento: (0-100)
    - velocidad: (0-100)
    - precision: (0-100)
    - eficiencia: (0-100)
    
    No incluyas texto fuera del JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Genera el benchmark de élite para la categoría ${category} ahora mismo.` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0].message.content;
    const data = JSON.parse(content || '{}');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Groq API:', error);
    return NextResponse.json({ error: 'Failed to fetch model ranking' }, { status: 500 });
  }
}
