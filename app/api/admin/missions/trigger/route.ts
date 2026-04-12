import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { mutateNewsForVideo } from '@/lib/groq';

export const dynamic = "force-dynamic";

/**
 * API Administrativa para Disparar Misiones Manuales (Reprocesar)
 * Protocolo Alpha // Gatillo de Beatriz Serie X Elite
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { newsId } = body;

    if (!newsId) {
      return NextResponse.json({ error: 'Falta newsId para el gatillo.' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // 1. Verificar Rol Admin (Seguridad de Búnker)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado: Solo Comandantes.' }, { status: 403 });
    }

    // 2. Obtener datos de la noticia original
    const { data: news, error: fetchError } = await supabase
      .from('news')
      .select('id, title, summary, content')
      .eq('id', newsId)
      .single();

    if (fetchError || !news) {
      return NextResponse.json({ error: 'Noticia no encontrada para reprocesar.' }, { status: 404 });
    }

    // 3. Mutar contenido para Reel (Protocolo Alpha)
    console.log(`🚀 [Reprocess] Beatriz mutando: ${news.title}`);
    const mutation = await mutateNewsForVideo(news.title, news.summary || '', news.content || '');

    // 4. Encolar nueva misión en la factoría
    const { data: mission, error: missionError } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('factory_missions' as any)
      .insert({
        news_id: news.id,
        title: mutation.video_title,
        description: mutation.video_description,
        content: `${mutation.video_hook}\n\n${news.content}`,
        platform: 'tiktok',
        mode: 'classic',
        status: 'pending',
        ai_metadata: {
          original_title: news.title,
          hook: mutation.video_hook,
          triggered_by: session.user.id,
          reprocessing: true
        }
      })
      .select()
      .single();

    if (missionError) {
      console.error('⚠️ [Reprocess] Error encolando misión:', missionError);
      return NextResponse.json({ error: 'Error al encolar misión industrial.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Misión encolada con éxito: ${mutation.video_title}. hmmmm... 🔥`,
      missionId: (mission as any)?.id
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('❌ [Trigger API] Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
