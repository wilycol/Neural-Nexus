import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_HIVE_SUPABASE_URL || "https://lkctxyoyajqrhaavnzrv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
// 🛰️ Conectado oficialmente a la Federación Neural Hive con Service Role Key (vía env)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let hiveClient: SupabaseClient<any, "public", any> | null = null;

/**
 * 🛰️ Hive Client - Conector Oficial de la Federación
 */
export const getSupabaseHiveClient = () => {
    if (hiveClient) return hiveClient;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Hive Client Error: Faltan variables de entorno para la Federación.");
        return null;
    }

    hiveClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
    return hiveClient;
};
