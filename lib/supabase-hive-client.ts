import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_HIVE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_HIVE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    
    hiveClient = createClient(supabaseUrl, supabaseAnonKey);
    return hiveClient;
};
