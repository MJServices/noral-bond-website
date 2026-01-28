import { createBrowserClient } from '@supabase/ssr';

// Initialize client if not already available globally, but ideally we reuse the one from context.
// However, for service functions, it's often cleaner to pass the client or recreate it if lightweight.
// Let's assume we use the global one setup in lib/supabase.ts but we need to import it properly.
// Checking previous files, src/lib/supabase.ts exports `supabase`.

import { supabase } from './supabase';

export interface XPState {
    xp: number;
    level: number;
    streak: number;
    last_reward_claim: string | null;
}

export interface ClaimResult {
    success: boolean;
    message?: string;
    new_xp?: number;
    new_level?: number;
    leveled_up?: boolean;
    xp_gained?: number;
    new_streak?: number;
}

export const XPService = {
    /**
     * Fetches the current user's XP stats.
     */
    async getUserStats(userId: string): Promise<XPState | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('xp, level, streak, last_reward_claim')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error(`Error fetching XP stats for user ${userId}:`, error);
            return null;
        }

        return data as XPState;
    },

    /**
     * Claims the daily login reward.
     */
    async claimDailyReward(userId: string): Promise<ClaimResult> {
        try {
            const { data, error } = await supabase.rpc('claim_daily_login', {
                p_user_id: userId
            });

            if (error) throw error;

            console.log("Claim result:", data);

            // The RPC returns a JSON object. We might need to normalize it.
            // Based on my SQL:
            // It returns add_xp result || { new_streak }
            // add_xp returns: { new_xp, new_level, leveled_up, xp_gained }
            // And if already claimed today, it returns { success: false, message: ... }

            return data as ClaimResult;

        } catch (error) {
            console.error('Error claiming daily reward:', error);
            return { success: false, message: 'Failed to claim reward' };
        }
    }
};
