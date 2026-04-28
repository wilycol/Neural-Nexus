import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  
  try {
    // 0. Autenticación Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 1. Quitar la marca de "destacado" a los posts de días anteriores
    await supabase
      .from('blog_posts')
      .update({ featured: false })
      .eq('featured', true);

    // 2. Obtener las 5 noticias más virales y recientes (últimas 48 horas para asegurar contenido)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { data: topNews, error: newsError } = await supabase
      .from('news')
      .select('*')
      .gte('published_at', twoDaysAgo.toISOString())
      .order('relevance_score', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(5);

    if (newsError || !topNews || topNews.length === 0) {
      console.warn("No se encontraron suficientes noticias frescas para el Top 5.");
      return NextResponse.json({ success: false, message: "No recent news found." });
    }

    const processedPosts = [];
    const authorId = process.env.BEATRIZ_AUTHOR_ID || "00000000-0000-0000-0000-000000000000";

    // 3. Crear los verdaderos blog_posts para el Top 5
    for (const news of topNews) {
      // Calcular tiempo de lectura aproximado (200 palabras por minuto)
      const wordCount = (news.content || news.summary || "").split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      const slug = `${news.slug.split('-')[0]}-top5-${Date.now().toString(36)}`;
      const imageUrl = news.image_url || `https://picsum.photos/seed/${slug}/800/450`;

      const { data: insertedPost, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: news.title,
          slug: slug,
          excerpt: news.summary || news.content?.substring(0, 200) || "",
          content: news.content || news.summary || "",
          image_url: imageUrl,
          video_url: news.video_url || null,
          author_id: authorId,
          author_nickname: "Neural Scout",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          read_time: readTime,
          view_count: Math.floor(Math.random() * 50) + 10, // Simulación orgánica inicial
          like_count: Math.floor(Math.random() * 20),
          comment_count: 0,
          share_count: Math.floor(Math.random() * 5),
          tags: news.tags || ['Top 5', 'Tendencias'],
          related_news: [news.id],
          featured: true
        })
        .select()
        .single();

      if (!insertError && insertedPost) {
        processedPosts.push(insertedPost);
      } else {
        console.error("Error insertando post del top 5:", insertError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Top 5 generator executed successfully",
      count: processedPosts.length,
      data: processedPosts.map(p => p.title)
    });

  } catch (error) {
    console.error('Error en cron job generate-top5:', error);
    return NextResponse.json(
      { error: 'Error en procesamiento' },
      { status: 500 }
    );
  }
}
