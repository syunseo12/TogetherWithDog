import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cbvihyeqqkhcbrmhwatp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_BYTsnkg3OzRcNNrkVy8lfQ_cWYGv034";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
