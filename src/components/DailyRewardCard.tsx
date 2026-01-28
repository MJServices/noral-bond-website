'use client';

import { useState } from 'react';
import { useXP } from '@/hooks/useXP';
import { Sparkles, Check, Clock } from 'lucide-react';

export default function DailyRewardCard() {
    const { stats, claimDaily, refreshStats } = useXP();
    const [claiming, setClaiming] = useState(false);
    const [hasJustClaimed, setHasJustClaimed] = useState(false);
    const [message, setMessage] = useState('');

    // Calculate if claimed today
    const lastClaimDate = stats.last_reward_claim ? new Date(stats.last_reward_claim) : null;
    const today = new Date();
    const isClaimedToday = lastClaimDate &&
        lastClaimDate.getDate() === today.getDate() &&
        lastClaimDate.getMonth() === today.getMonth() &&
        lastClaimDate.getFullYear() === today.getFullYear();

    const showClaimed = isClaimedToday || hasJustClaimed;

    const handleClaim = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (claiming) return;

        setClaiming(true);
        const result = await claimDaily();
        setClaiming(false);

        if (result && result.success === false) {
            // Already claimed (shouldn't happen if button disabled) or error
            setMessage(result.message || 'Error claiming.');
        } else {
            setHasJustClaimed(true);
        }
    };

    // Determine next reward based on streak
    // Logic: 1-2 days: 50XP, 3-6 days: 100XP, 7+ days: 200XP
    // If claimed today, the streak is already updated for tomorrow's calculation reference? 
    // Actually, if claimed today, the NEXT reward is based on (streak + 1).
    // If NOT claimed today, the CURRENT reward is based on (streak + 1) if consecutive, 
    // or resets to 1 if missed. 
    // For simplicity, let's just show "Today's Reward" if available, or "Next Reward".

    const currentStreak = stats.streak || 0;

    // Calculate potential reward for *today* (if not claimed) or *tomorrow* (if claimed)
    // This is purely visual. The backend handles the logic.
    const nextRewardValue = currentStreak < 2 ? 50 : currentStreak < 6 ? 100 : 200;

    return (
        <div className="bg-gradient-to-br from-[#1A1D21] to-[#0E1113] border border-white/10 rounded-xl p-6 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8459E2]/10 to-[#EC4899]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left Side: Stats */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Daily Login Bonus</h3>
                        <div className="flex items-center gap-2 text-sm text-[#D0D0D0]">
                            <span>Current Streak:</span>
                            <span className="text-[#FFD700] font-bold">{stats.streak} Days</span>
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">🔥 Fire</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Action */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    {showClaimed ? (
                        <button disabled className="flex items-center gap-2 bg-white/5 border border-white/5 text-white/50 px-6 py-2 rounded-lg font-medium cursor-not-allowed">
                            <Check className="w-4 h-4" />
                            Claimed
                        </button>
                    ) : (
                        <div
                            role="button"
                            onClick={handleClaim}
                            className={`flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-6 py-2 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/10 cursor-pointer ${claiming ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {claiming ? 'Claiming...' : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Claim +{nextRewardValue} XP
                                </>
                            )}
                        </div>
                    )}

                    {showClaimed && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            <span>Next reward in 24h</span>
                        </div>
                    )}
                    {showClaimed && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            <span>Next reward in 24h</span>
                        </div>
                    )}
                    {message && (
                        <div className="text-red-400 text-xs mt-1 text-center animate-pulse">
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {/* Streak Progress Dots (Visual Only) */}
            <div className="mt-6 flex items-center gap-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const isActive = currentStreak >= day;
                    return (
                        <div key={day} className={`h-2 rounded-full transition-all duration-300 ${isActive ? 'w-8 bg-[#FFD700]' : 'w-2 bg-white/10'}`} />
                    );
                })}
            </div>
        </div>
    );
}
