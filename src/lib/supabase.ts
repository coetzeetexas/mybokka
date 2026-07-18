import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase env vars are not set (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
    'The storefront will render but product/cart data will not load. See .env.example.'
  );
}

// createClient() throws synchronously on an empty/invalid URL, which would take
// down the whole module graph (and the entire site) before React ever mounts.
// Fall back to a well-formed placeholder so the client always constructs; calls
// made through it will simply fail (and are already caught) until real env vars are set.
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-anon-key');
