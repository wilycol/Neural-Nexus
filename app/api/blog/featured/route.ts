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

    let { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    // Si no hay posts en blog_posts, intentamos con la tabla de news para el Top 5
    if (!data || data.length === 0) {
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('view_count', { ascending: false }) // Priorizar los más vistos
        .limit(limit);
      
      if (!newsError) {
        data = newsData;
      }
    }

    if (error) {
      console.error('Error fetching featured posts:', error);
      return NextResponse.json(
        { error: 'Error al obtener posts destacados' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error in featured posts API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
