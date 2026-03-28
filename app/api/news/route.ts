import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getPagination } from '@/lib/supabase';
import type { Database } from '@/types/database';

const NEWS_CATEGORIES: Array<Database["public"]["Tables"]["news"]["Row"]["category"]> = [
  "modelos",
  "herramientas",
  "memes",
  "papers",
  "drama",
  "general",
];
const NEWS_CATEGORY_SET = new Set(NEWS_CATEGORIES);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isTopStory = searchParams.get('top') === 'true';
    
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
        total: 0,
        page,
        limit,
        hasMore: false,
        warning: 'Supabase no está configurado',
      });
    }
    const { from, to } = getPagination(page, limit);

    let query = supabase
      .from('news')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    const categoryFilter = category && NEWS_CATEGORY_SET.has(category as Database["public"]["Tables"]["news"]["Row"]["category"])
      ? (category as Database["public"]["Tables"]["news"]["Row"]["category"])
      : null;
    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }

    if (isTopStory) {
      query = query.eq('is_top_story', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,tags.cs.{${search}}`);
    }

    // Ordenar por fecha de publicación
    query = query.order('published_at', { ascending: false });

    // Paginación
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json(
        { error: 'Error al obtener noticias' },
        { status: 500 }
      );
    }

    const totalCount = count || 0;
    const hasMore = from + data.length < totalCount;

    return NextResponse.json({
      data: data || [],
      total: totalCount,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva noticia (para el crawler)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createServerClient();

    // Verificar si ya existe una noticia similar
    const { data: existing } = await supabase
      .from('news')
      .select('id')
      .or(`title.ilike.%${body.title.substring(0, 50)}%,source_url.eq.${body.source_url}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Noticia ya existe', id: existing[0].id },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('news')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating news:', error);
      return NextResponse.json(
        { error: 'Error al crear noticia' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
