import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
    try {
        // Step 1: Init Client
        const supabase = await createClient(); // Awaiting to check if this throws

        // Step 2: Query Table
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .limit(1);

        return NextResponse.json({
            status: 'ok',
            client_initialized: true,
            table_query_data: data,
            table_query_error: error,
            env_url_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            env_key_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'crash',
            error_message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
