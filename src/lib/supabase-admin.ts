import { createClient } from '@supabase/supabase-js';

// Note: This client should ONLY be used in server-side contexts (API routes, Server Components)
// effectively bypassing Row Level Security. Never expose SUPABASE_SERVICE_ROLE_KEY to the client.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase URL or Service Role Key. Admin client will not work.');
}

// Fallback to avoid build errors if keys are missing
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseServiceKey || 'placeholder-key';

export const supabaseAdmin = createClient(url, key, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
