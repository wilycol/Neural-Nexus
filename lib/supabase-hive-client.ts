import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_HIVE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_HIVE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 🛰️ Hive Client - Conector Oficial de la Federación
 * Este cliente apunta específicamente a la base de datos de los Nodos (Cuenta Oficial)
 * para aliviar la carga de la cuenta personal del Portal.
 */
export const getSupabaseHiveClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("❌ Hive Client Error: Faltan variables de entorno para la Federación.");
        return null;
    }
    return createClient(supabaseUrl, supabaseAnonKey);
};
