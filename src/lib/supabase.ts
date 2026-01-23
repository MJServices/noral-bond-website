import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use the official SSR helper which automatically handles cookies correctly for Next.js
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
