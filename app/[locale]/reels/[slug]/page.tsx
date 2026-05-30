import { Metadata, ResolvingMetadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { ClientRedirect } from "./client-redirect";

type Props = {
  params: { slug: string; locale: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = getSupabaseServerClient();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!news) {
    return {
      title: "Reel no encontrado - Neural Nexus",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = news.cover_url || news.image_url || "";

  return {
    title: `${news.title} | Neural Nexus Reels`,
    description: news.summary || "Mira este reel en Neural Nexus.",
    openGraph: {
      title: news.title,
      description: news.summary || "Mira este reel en Neural Nexus.",
      url: `/reels/${news.slug}`,
      siteName: "Neural Nexus",
      type: "video.other",
      videos: news.video_url ? [{ url: news.video_url }] : [],
      images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
    },
    twitter: {
      card: "player",
      title: news.title,
      description: news.summary || "Mira este reel en Neural Nexus.",
      images: imageUrl ? [imageUrl] : [],
      players: news.video_url ? [news.video_url] : [],
    },
  };
}

export default async function ReelSharePage({ params }: Props) {
  const supabase = getSupabaseServerClient();
  const { data: news } = await supabase
    .from("news")
    .select("id")
    .eq("slug", params.slug)
    .single();

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center">
        <h1 className="text-2xl font-bold mb-2">Reel no encontrado</h1>
        <p className="text-white/60">El enlace que buscas no existe o fue eliminado.</p>
      </div>
    );
  }

  // Renderiza el componente de redirección inmediato pasándole el ID
  return <ClientRedirect newsId={news.id} />;
}
