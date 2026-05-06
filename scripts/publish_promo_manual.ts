import { getSupabaseHiveClient } from "../lib/supabase-hive-client";

async function publishPromo() {
  const supabase = getSupabaseHiveClient();
  if (!supabase) {
    console.error("Error: Supabase Hive client is null");
    process.exit(1);
  }
  
  const promoData = {
    title: "Neural Nexus: La Colmena Nunca Duerme",
    content: "Descubre la evolución de los Neural Sites. Sitios web vivos inyectados con el ADN de Beatriz AI.",
    video_url: "/media/promo_nexus_final.mp4",
    category: "Federation News",
    is_top_5: true,
    published_at: new Date().toISOString()
  };

  console.log("Publicando promo en el Portal...");
  
  const { data, error } = await supabase
    .from('news')
    .insert([promoData])
    .select();

  if (error) {
    console.error("Error al publicar:", error.message);
    process.exit(1);
  }

  console.log("¡Éxito! Promo publicada correctamente:", data);
}

publishPromo();
