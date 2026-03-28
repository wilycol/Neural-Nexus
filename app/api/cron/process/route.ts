import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createServerClient } from '@/lib/supabase';
import { processNewsWithAI, generateBlogPost } from '@/lib/groq';
import { generateSlug } from '@/lib/utils';
import type { Database } from '@/types/database';

const rssParser = new Parser();

const asString = (value: unknown) => (typeof value === 'string' ? value : '');
const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

export const dynamic = "force-dynamic";

// Configuración de fuentes RSS
const RSS_SOURCES = [
  {
    name: 'TechCrunch AI',
    rss_url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'general' as const,
  },
  {
    name: 'OpenAI Blog',
    rss_url: 'https://openai.com/blog/rss.xml',
    category: 'modelos' as const,
  },
  {
    name: 'Anthropic',
    rss_url: 'https://www.anthropic.com/blog/rss.xml',
    category: 'modelos' as const,
  },
  {
    name: 'Google DeepMind',
    rss_url: 'https://deepmind.google/blog/rss.xml',
    category: 'modelos' as const,
  },
  {
    name: 'Hugging Face',
    rss_url: 'https://huggingface.co/blog/feed.xml',
    category: 'herramientas' as const,
  },
  {
    name: 'MIT Technology Review',
    rss_url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    category: 'papers' as const,
  },
  {
    name: 'VentureBeat AI',
    rss_url: 'https://venturebeat.com/category/ai/feed/',
    category: 'general' as const,
  },
  {
    name: 'Wired AI',
    rss_url: 'https://www.wired.com/tag/artificial-intelligence/rss',
    category: 'general' as const,
  },
];

// Handler para cron job de Vercel
export async function GET(request: NextRequest) {
  try {
    // Verificar token de autorización (opcional pero recomendado)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const results = {
      news_processed: 0,
      news_published: 0,
      blog_posts_generated: 0,
      errors: [] as string[],
    };

    const supabase = createServerClient();

    // 1. Fetch de todas las fuentes
    const allNewsItems: Array<{
      title: string;
      link: string;
      content: string;
      contentSnippet: string;
      pubDate: string;
      categories: string[];
      source: string;
      sourceCategory: Database["public"]["Tables"]["news"]["Row"]["category"];
    }> = [];

    for (const source of RSS_SOURCES) {
      try {
        const feed = await rssParser.parseURL(source.rss_url);
        
        for (const item of feed.items?.slice(0, 3) || []) {
          const title = asString((item as Record<string, unknown>)?.title);
          const link = asString((item as Record<string, unknown>)?.link);
          const content = asString((item as Record<string, unknown>)?.content);
          const contentEncoded = asString((item as Record<string, unknown>)?.["content:encoded"]);
          const contentSnippet = asString((item as Record<string, unknown>)?.contentSnippet);
          const pubDate = asString((item as Record<string, unknown>)?.pubDate);
          const isoDate = asString((item as Record<string, unknown>)?.isoDate);
          const categories = asStringArray((item as Record<string, unknown>)?.categories);

          allNewsItems.push({
            title,
            link,
            content: content || contentEncoded || contentSnippet,
            contentSnippet,
            pubDate: pubDate || isoDate || new Date().toISOString(),
            categories,
            source: source.name,
            sourceCategory: source.category,
          });
        }
      } catch (error) {
        const errorMsg = `Error en ${source.name}: ${error instanceof Error ? error.message : 'Unknown'}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    // 2. Procesar cada noticia con IA y guardar
    const processedNews: Database["public"]["Tables"]["news"]["Row"][] = [];

    for (const item of allNewsItems) {
      try {
        // Verificar duplicados
        const { data: existing } = await supabase
          .from('news')
          .select('id')
          .or(`title.ilike.%${item.title.substring(0, 50)}%,source_url.eq.${item.link}`)
          .limit(1);

        if (existing && existing.length > 0) {
          continue;
        }

        results.news_processed++;

        // Procesar con IA
        const processed = await processNewsWithAI(
          item.title,
          item.content,
          item.source
        );

        // Solo publicar si el score es alto o es noticia importante
        if (processed.should_publish && processed.relevance_score >= 0.5) {
          const slug = generateSlug(processed.title);
          const imageUrl = `https://picsum.photos/seed/${slug}/800/450`;

          const { data: newsData, error: insertError } = await supabase
            .from('news')
            .insert({
              title: processed.title,
              summary: processed.summary,
              content: item.content,
              image_url: imageUrl,
              source_name: item.source,
              source_url: item.link,
              published_at: item.pubDate,
              category: processed.category || item.sourceCategory,
              tags: processed.tags,
              relevance_score: processed.relevance_score,
              mention_count: 1,
              is_top_story: processed.relevance_score >= 0.8,
              ai_generated: true,
              slug: `${slug}-${Date.now().toString(36)}`,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            results.errors.push(`Error insertando: ${insertError.message}`);
          } else {
            results.news_published++;
            processedNews.push(newsData);
          }
        }
      } catch (error) {
        const errorMsg = `Error procesando noticia: ${error instanceof Error ? error.message : 'Unknown'}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    // 3. Generar Top 5 posts si hay suficientes noticias virales
    const topNews = processedNews
      .filter(n => n.relevance_score >= 0.7)
      .slice(0, 5);

    if (topNews.length >= 3) {
      try {
        const blogPost = await generateBlogPost(
          topNews.map(n => ({
            title: n.title,
            summary: n.summary,
            source: n.source_name,
          }))
        );

        const { error: blogError } = await supabase
          .from('blog_posts')
          .insert({
            title: blogPost.title,
            slug: `top-5-${Date.now().toString(36)}`,
            excerpt: blogPost.excerpt,
            content: blogPost.content,
            author_id: 'system',
            author_nickname: 'Neural AI',
            published_at: new Date().toISOString(),
            read_time: blogPost.read_time,
            tags: blogPost.tags,
            related_news: topNews.map(n => n.id),
            featured: true,
            view_count: 0,
            like_count: 0,
            comment_count: 0,
            share_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (blogError) {
          results.errors.push(`Error creando blog: ${blogError.message}`);
        } else {
          results.blog_posts_generated++;
        }
      } catch (error) {
        const errorMsg = `Error generando blog: ${error instanceof Error ? error.message : 'Unknown'}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });

  } catch (error) {
    console.error('Error en cron job:', error);
    return NextResponse.json(
      { 
        error: 'Error en procesamiento',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
