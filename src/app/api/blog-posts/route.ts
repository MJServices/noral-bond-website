import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch published blog posts from Supabase
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            // If table doesn't exist or other error, return empty list instead of crashing
            return NextResponse.json(
                { posts: [] },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { posts: data || [] },
            { status: 200 }
        );
    } catch (error) {
        console.error('Blog posts error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
