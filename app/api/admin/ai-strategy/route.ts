import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = "force-dynamic";

/**
 * API Administrativa para Consultas de IA de Beatriz (Gemini Pro)
 * Blindada bajo Protocolo de Seguridad Neural Nexus
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();

    // 1. Verificar Autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    // 2. Verificar Rol Admin (Seguridad de Búnker)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado: Solo Comandantes.' }, { status: 403 });
    }

    // 3. Obtener cuerpo de la petición
    const { systemPrompt, userQuery } = await request.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY no configurada en el servidor.' }, { status: 500 });
    }

    // 4. Llamar a Gemini Pro (Servidor a Servidor)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `System Instruction: ${systemPrompt}\n\nUser: ${userQuery}` 
          }] 
        }]
      })
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('Gemini Failure:', result);
      return NextResponse.json({ error: 'La IA no devolvió una respuesta válida.' }, { status: 500 });
    }

    return NextResponse.json({ text });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('❌ [AI Strategy API] Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
