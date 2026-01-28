import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Test Query 1: Select * to see what columns exist
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // Test Query 2: Select specific XP columns
        const { data: xpData, error: xpError } = await supabase
            .from('profiles')
            .select('xp, level, streak, last_reward_claim')
            .eq('id', user.id)
            .single();

        return NextResponse.json({
            user: user.id,
            profile_structure: profile ? Object.keys(profile) : 'Profile not found',
            profile_error: profileError,
            xp_query_data: xpData,
            xp_query_error: xpError
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
