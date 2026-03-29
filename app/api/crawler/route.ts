import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createServerClient } from '@/lib/supabase-server';
import { generateSlug } from '@/lib/utils';
import type { Database } from '@/types/database';

const rssParser = new Parser();

type CrawlerSource = {
  id?: string;
  name: string;
  rss_url: string;
  category: string;
  is_active?: boolean;
  priority?: number;
};

type ParsedRssItem = {
  title: string;
  link: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  categories: string[];
  creator?: string;
};

// Fuentes RSS iniciales
const DEFAULT_SOURCES = [
  {
    name: 'TechCrunch AI',
    rss_url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'Inteligencia Artificial',
  },
  {
    name: 'Wired AI',
    rss_url: 'https://www.wired.com/tag/artificial-intelligence/rss',
    category: 'Inteligencia Artificial',
  },
  {
    name: 'Hugging Face Blog',
    rss_url: 'https://huggingface.co/blog/feed.xml',
    category: 'Software',
  },
  {
    name: 'OpenAI Blog',
    rss_url: 'https://openai.com/blog/rss.xml',
    category: 'Software',
  },
  {
    name: 'Google AI Blog',
    rss_url: 'https://ai.googleblog.com/feeds/posts/default',
    category: 'Software',
  },
  {
    name: 'Anthropic',
    rss_url: 'https://www.anthropic.com/blog/rss.xml',
    category: 'Software',
  },
  {
    name: 'MIT Technology Review',
    rss_url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    category: 'Futuro y Tendencias',
  },
  {
    name: 'VentureBeat AI',
    rss_url: 'https://venturebeat.com/category/ai/feed/',
    category: 'Inteligencia Artificial',
  },
  {
    name: 'AI Trends',
    rss_url: 'https://www.aitrends.com/feed/',
    category: 'Inteligencia Artificial',
  },
  {
    name: 'DeepMind Blog',
    rss_url: 'https://deepmind.google/blog/rss.xml',
    category: 'modelos',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '5');

    const supabase = createServerClient();

    // Obtener fuentes activas
    let sources: Array<Database["public"]["Tables"]["news_sources"]["Row"] | (CrawlerSource & { id: string })>;
    if (sourceId) {
      const { data } = await supabase
        .from('news_sources')
        .select('*')
        .eq('id', sourceId)
        .eq('is_active', true);
      sources = data || [];
    } else {
      const { data } = await supabase
        .from('news_sources')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });
      sources = data || [];
    }

    // Si no hay fuentes configuradas, usar las default
    if (!sources || sources.length === 0) {
      sources = DEFAULT_SOURCES.map((s, i) => ({
        ...s,
        id: `default-${i}`,
        is_active: true,
        priority: 1,
      }));
    }

    const results: Array<{
      source: string;
      source_id: string;
      items: ParsedRssItem[];
      success: boolean;
      error?: string;
    }> = [];

    for (const source of sources) {
      try {
        const feed = await rssParser.parseURL(source.rss_url);
        
        const items: ParsedRssItem[] = (feed.items || []).slice(0, limit).map((item: {
          title?: string;
          link?: string;
          content?: string;
          contentSnippet?: string;
          pubDate?: string;
          isoDate?: string;
          categories?: string[];
          creator?: string;
          author?: string;
          [key: string]: unknown;
        }) => ({
          title: item.title || '',
          link: item.link || '',
          content: (item.content as string | undefined) || (item["content:encoded"] as string | undefined) || '',
          contentSnippet: item.contentSnippet || '',
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          categories: item.categories || [],
          creator: item.creator || item.author,
        }));

        results.push({
          source: source.name,
          source_id: source.id,
          items,
          success: true,
        });

        // Actualizar última fecha de fetch
        if (!source.id.startsWith('default-')) {
          const { data: current } = await supabase
            .from('news_sources')
            .select('fetch_count')
            .eq('id', source.id)
            .maybeSingle();

          await supabase
            .from('news_sources')
            .update({
              last_fetch_at: new Date().toISOString(),
              fetch_count: (current?.fetch_count || 0) + 1,
            })
            .eq('id', source.id);
        }

      } catch (error) {
        console.error(`Error fetching ${source.name}:`, error);
        results.push({
          source: source.name,
          source_id: source.id,
          items: [],
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      sources_processed: results.length,
      results,
    });
  } catch (error) {
    console.error('Error in crawler:', error);
    return NextResponse.json(
      { error: 'Error en el crawler' },
      { status: 500 }
    );
  }
}

// POST - Procesar y guardar noticias del crawler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body?.items) ? (body.items as ParsedRssItem[]) : [];
    const source_name = typeof body?.source_name === 'string' ? body.source_name : '';

    const supabase = createServerClient();
    const processed: Database["public"]["Tables"]["news"]["Row"][] = [];
    const errors: Array<{ item: string; error: string }> = [];

    for (const item of items) {
      try {
        if (!item?.title || !item?.link) continue;

        // Verificar duplicados
        const { data: existing } = await supabase
          .from('news')
          .select('id')
          .or(`title.ilike.%${item.title.substring(0, 50)}%,source_url.eq.${item.link}`)
          .limit(1);

        if (existing && existing.length > 0) {
          continue; // Saltar duplicados
        }

        // Crear slug
        const slug = generateSlug(item.title);

        // Insertar noticia
        const { data, error } = await supabase
          .from('news')
          .insert({
            title: item.title,
            summary: item.contentSnippet || item.content?.substring(0, 300) || '',
            content: item.content,
            source_name,
            source_url: item.link,
            published_at: item.pubDate,
            category: 'Inteligencia Artificial',
            tags: item.categories || [],
            relevance_score: 0.5,
            mention_count: 1,
            is_top_story: false,
            ai_generated: false,
            slug: `${slug}-${Date.now().toString(36)}`,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          errors.push({ item: item.title, error: error.message });
        } else {
          processed.push(data);
        }
      } catch (error) {
        errors.push({
          item: item.title,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      processed: processed.length,
      errors: errors.length,
      data: processed,
      error_details: errors,
    });
  } catch (error) {
    console.error('Error processing crawler data:', error);
    return NextResponse.json(
      { error: 'Error al procesar datos' },
      { status: 500 }
    );
  }
}
