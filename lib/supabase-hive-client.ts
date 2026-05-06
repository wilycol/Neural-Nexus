import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_HIVE_SUPABASE_URL || "https://lkctxyoyajqrhaavnzrv.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_HIVE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrY3R4eW95YWpxcmhhYXZuenJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM1NDUsImV4cCI6MjA5MzQ4OTU0NX0.-RQMZ8LJCt7OIVjTtH999BwuvkltPcPb9Arfevr3MZo";
// 🛰️ Conectado oficialmente a la Federación Neural Hive

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let hiveClient: SupabaseClient<any, "public", any> | null = null;

/**
 * 🛰️ Hive Client - Conector Oficial de la Federación
 */
export const getSupabaseHiveClient = () => {
    if (hiveClient) return hiveClient;
    
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("❌ Hive Client Error: Faltan variables de entorno para la Federación.");
        return null;
    }

    console.log("🛰️ Hive Client: Conectando a Federación en:", supabaseUrl.slice(0, 20) + "...");
    
    hiveClient = createClient(supabaseUrl, supabaseAnonKey);
    return hiveClient;
};
