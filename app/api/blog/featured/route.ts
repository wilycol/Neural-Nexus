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

    // 1. Intentar obtener posts marcados como destacados en blog_posts
    const { data: blogData, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (blogError) {
      console.error('Error fetching blog featured:', blogError);
    }

    // Usamos any[] para permitir tanto datos de blog_posts como de news en el fallback
    let finalData: any[] = blogData || [];

    // 2. Si no hay destacados, fallback a las noticias más vistas de la tabla 'news'
    if (finalData.length === 0) {
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (!newsError && newsData) {
        finalData = newsData;
      } else if (newsError) {
        console.error('Error fetching news fallback:', newsError);
      }
    }

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
