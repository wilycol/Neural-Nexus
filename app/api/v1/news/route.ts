import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Neural Connect API v1 - News Distribution Endpoint
 * Model: SaaS (B2B Content Syndication)
 */
export async function GET(request: Request) {
  try {
    // 1. Initial Authentication Check (Simulated for Industrial B2B)
    const authHeader = request.headers.get("Authorization");
    
    // Check for API Key (Simulation)
    // In production, we would verify this against a 'api_keys' table in Supabase
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { 
          error: "Unauthorized", 
          message: "A valid Neural Connect API Key is required for access.",
          documentation: "https://neural-nexus.ai/developers"
        },
        { status: 401 }
      );
    }

    // 2. Fetch Production Data
    const supabase = getSupabaseServerClient();
    const { data: news, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    // 3. Return Standardized B2B JSON
    return NextResponse.json({
      version: "1.0",
      status: "success",
      metadata: {
        total_results: news?.length || 0,
        request_id: crypto.randomUUID(),
        model: "SaaS_Pro_Access"
      },
      data: news?.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        published_at: item.published_at,
        category: item.category,
        content_url: `https://neural-nexus.ai/news/${item.slug}`,
        media: {
          type: item.content_type,
          url: item.cover_url || item.image_url,
          is_short: item.is_short
        },
        source: {
          name: item.source_name,
          url: item.source_url
        }
      }))
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      }
    });

  } catch (err: unknown) {
    console.error("Neural Connect API Error:", err);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: "Neural Connect is experiencing industrial maintenance." 
      },
      { status: 500 }
    );
  }
}

/**
 * Options handler for CORS (B2B Widget support)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
