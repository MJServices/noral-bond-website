'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { XPService, XPState, ClaimResult } from '@/lib/xpService';

interface XPContextType {
    stats: XPState;
    loading: boolean;
    refreshStats: () => Promise<void>;
    claimDaily: () => Promise<ClaimResult | undefined>;
}

const defaultStats: XPState = {
    xp: 0,
    level: 1,
    streak: 0,
    last_reward_claim: null
};

const XPContext = createContext<XPContextType>({
    stats: defaultStats,
    loading: true,
    refreshStats: async () => { },
    claimDaily: async () => undefined
});

export function XPProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [stats, setStats] = useState<XPState>(defaultStats);
    const [loading, setLoading] = useState(true);

    const refreshStats = useCallback(async () => {
        if (!user?.id) return;

        try {
            const data = await XPService.getUserStats(user.id);
            if (data) {
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch XP stats", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const claimDaily = async (): Promise<ClaimResult | undefined> => {
        if (!user?.id) return undefined;

        const result = await XPService.claimDailyReward(user.id);

        if (result?.success !== false) {
            // If successful (or undefined success which implies success in some designs, 
            // but let's assume result contains new data), we should refresh or update local state.
            // Our RPC returns the new values, so we could optimistically update, 
            // but calling refreshStats is safer and easier.
            await refreshStats();
        }
        return result;
    };

    // Initial fetch when user logs in
    useEffect(() => {
        if (user?.id) {
            refreshStats();
        } else {
            setStats(defaultStats);
            setLoading(false);
        }
    }, [user?.id, refreshStats]);

    return (
        <XPContext.Provider value={{ stats, loading, refreshStats, claimDaily }}>
            {children}
        </XPContext.Provider>
    );
}

export function useXP() {
    return useContext(XPContext);
}
