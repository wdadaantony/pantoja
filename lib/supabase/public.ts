import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Este cliente no lee cookies, por lo que permite la optimización estática y caché (ISR) en Next.js
export const supabasePublic = url && key ? createSupabaseClient(url, key) : null;

