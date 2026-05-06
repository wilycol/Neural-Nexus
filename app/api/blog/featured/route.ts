import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const supabase = (() => {
      try {
        return createServerClient();
      } catch {
        return null;
      }
    })();
    
    if (!supabase) {
      return NextResponse.json({
        data: [],
        count: 0,
        warning: 'Supabase no está configurado',
      });
    }

    // 🚀 Lógica Industrial Unificada: Priorizar por Novedad y Flag Top 5
    // Buscamos directamente en la tabla 'news' que es la que Beatriz alimenta
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('is_top_5', { ascending: false }) // Primero los marcados como Top 5
      .order('published_at', { ascending: false }) // Luego por fecha más reciente
      .limit(limit);

    if (newsError) {
      console.error('Error fetching Top 5 news:', newsError);
      return NextResponse.json({ data: [], count: 0, error: newsError.message });
    }

    // Mapeo compatible con el frontend
    const finalData = (newsData || []).map(item => ({
      id: item.id,
      title: item.title,
      image_url: item.image_url,
      published_at: item.published_at,
      excerpt: item.summary || item.content?.substring(0, 160) + "...",
      author_nickname: item.author_nickname || "Federación",
      read_time: item.read_time || 3,
      like_count: item.like_count,
      comment_count: item.comment_count,
      share_count: item.share_count,
      slug: item.slug || item.id
    }));

    return NextResponse.json({
      data: finalData,
      count: finalData.length,
    });
  } catch (err: unknown) {
    console.error('Error in featured posts API:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
