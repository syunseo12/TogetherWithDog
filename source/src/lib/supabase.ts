import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    togetherWithDogConfig?: { url: string; key: string };
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.togetherWithDogConfig?.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.togetherWithDogConfig?.key;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and public client key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
