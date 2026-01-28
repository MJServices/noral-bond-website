'use client';

import {
    Trophy,
    Target,
    BarChart2,
    Activity,
    Star,
    Zap,
    Heart,
    MessageSquare,
    BookOpen,
    Gift,
    Shield,
    TrendingUp,
    Medal,
    CalendarCheck,
    CheckCircle,
    Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useXP } from '@/hooks/useXP';

export default function ProgressPage() {
    const { user } = useAuth();
    const { stats: xpStats } = useXP(); // Use the global XP hook
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        level: xpStats.level,
        totalXP: xpStats.xp,
        nextLevelXP: 0, // Calculated below
        xpProgress: 0, // Calculated below
        dailyXP: 0,
        streak: xpStats.streak,
        bondScore: 0,
        messagesSent: 0,
        achievementsUnlocked: 0,
        totalAchievements: 5,
        dailyMissionsComplete: 0,
        weeklyActiveDays: 0,
        weeklyBonusClaimed: false,
        chartData: [] as any[]
    });

    const [achievements, setAchievements] = useState<any[]>([]);
    const [missions, setMissions] = useState<any[]>([]);

    useEffect(() => {
        // Sync props from hook to local state (or just use hook directly in render, 
        //   but we need to merge with other stats fetched here)
        // Actually, let's calculate level progress here based on XP from hook

        // Level Calc Logic (match SQL): 
        // 1-6: 0-99 (1), 100-299 (2), 300-599 (3), 600-999 (4), 1000-1499 (5), 1500-2099 (6)
        // 7+: 2100 + 300 per level.
        // We need "Next Level XP" and "Current Level Progress" relative to START of that level.

        const currentXP = xpStats.xp;
        const currentLevel = xpStats.level;
        let startOfLevelXP = 0;
        let nextLevelXPThreshold = 100;

        // Replicate SQL logic for display
        if (currentLevel === 1) { startOfLevelXP = 0; nextLevelXPThreshold = 100; }
        else if (currentLevel === 2) { startOfLevelXP = 100; nextLevelXPThreshold = 300; }
        else if (currentLevel === 3) { startOfLevelXP = 300; nextLevelXPThreshold = 600; }
        else if (currentLevel === 4) { startOfLevelXP = 600; nextLevelXPThreshold = 1000; }
        else if (currentLevel === 5) { startOfLevelXP = 1000; nextLevelXPThreshold = 1500; }
        else if (currentLevel === 6) { startOfLevelXP = 1500; nextLevelXPThreshold = 2100; }
        else {
            // Lvl 7 starts at 2100. Each level is 300.
            // Level N starts at: 2100 + (N-7)*300
            startOfLevelXP = 2100 + (currentLevel - 7) * 300;
            nextLevelXPThreshold = startOfLevelXP + 300;
        }

        const xpNeededForNext = nextLevelXPThreshold - currentXP;
        const progressInLevel = currentXP - startOfLevelXP;
        const totalLevelSpan = nextLevelXPThreshold - startOfLevelXP;
        const progressPercent = Math.min(100, Math.max(0, (progressInLevel / totalLevelSpan) * 100));

        setStats(prev => ({
            ...prev,
            level: currentLevel,
            totalXP: currentXP,
            streak: xpStats.streak,
            nextLevelXP: xpNeededForNext,
            xpProgress: progressPercent
        }));

    }, [xpStats]);

    useEffect(() => {
        if (!user?.id) return;

        async function fetchOtherStats() {
            try {
                // Fetch Profile Stats (excluding XP which we get from hook)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('bond_score, conversations_count, last_weekly_bonus_claimed_at')
                    .eq('id', user!.id)
                    .maybeSingle();

                // ... (Keep existing daily activity logic) ...
                const today = new Date();
                const { data: dailyActivityData } = await supabase
                    .from('user_daily_activity')
                    .select('xp_earned')
                    .eq('user_id', user!.id)
                    .order('activity_date', { ascending: false })
                    .limit(1);
                const dailyActivity = dailyActivityData?.[0];

                // Fetch activity for last 7 days for Weekly Bonus and Chart
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today
                const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

                const { data: weeklyActivity, count: activeDaysCount } = await supabase
                    .from('user_daily_activity')
                    .select('activity_date, xp_earned', { count: 'exact' })
                    .eq('user_id', user!.id)
                    .gte('activity_date', sevenDaysAgoStr); // Fetch >= 7 days ago

                // Generate Chart Data (Last 7 Days dynamic)
                const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const weekData: { day: string; val: number; active: boolean; date: string }[] = [];

                // Helper to format date as YYYY-MM-DD local
                const formatDate = (date: Date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                // Generate the last 7 days array
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(today.getDate() - i);
                    const dateStr = formatDate(d);
                    const dayLabel = daysMap[d.getDay()];

                    // Find activity for this day
                    // Note: Date strings from DB might be UTC or Local. 
                    // Usually simple date strings (YYYY-MM-DD) compare fine if we stick to string comparison.
                    const activity = weeklyActivity?.find(a => a.activity_date === dateStr);
                    const val = activity?.xp_earned || 0;

                    weekData.push({
                        day: dayLabel,
                        val: val,
                        active: val > 0,
                        date: dateStr // helpful for debugging
                    });
                }

                // Update local 'stats' state with weeklyBonus data as before...

                let bonusClaimedRecently = false;
                if (profile?.last_weekly_bonus_claimed_at) {
                    const lastClaimDate = new Date(profile.last_weekly_bonus_claimed_at);
                    if (lastClaimDate >= sevenDaysAgo) {
                        bonusClaimedRecently = true;
                    }
                }

                // Achievement Counts
                const { count: unlockedCount } = await supabase
                    .from('user_achievements')
                    .select('achievement_id', { count: 'exact', head: true })
                    .eq('user_id', user!.id);

                // Update stats
                setStats(prev => ({
                    ...prev,
                    dailyXP: dailyActivity?.xp_earned || 0,
                    bondScore: profile?.bond_score || 0,
                    messagesSent: profile?.conversations_count || 0,
                    achievementsUnlocked: unlockedCount || 0,
                    weeklyActiveDays: activeDaysCount || 0,
                    weeklyBonusClaimed: bonusClaimedRecently,
                    chartData: weekData // Add to state
                }));

                // Fetch Achievements List
                const { data: userAchievements } = await supabase
                    .from('user_achievements')
                    .select('achievement_id, achievements(title, description, xp_reward)')
                    .eq('user_id', user!.id);

                if (userAchievements) {
                    setAchievements(userAchievements.map((ua: any) => ({
                        id: ua.achievement_id,
                        title: ua.achievements?.title,
                        description: ua.achievements?.description,
                        xp: `+${ua.achievements?.xp_reward} XP`,
                        unlocked: true
                    })));
                }

            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOtherStats();
    }, [user?.id]);

    // Fetch Missions
    useEffect(() => {
        if (!user) return;
        async function fetchMissions() {
            try {
                // Get definitions
                const { data: allMissions } = await supabase
                    .from('missions')
                    .select('*');

                // Get user progress (fetch all recent to handle timezone mismatches)
                if (!user) return;

                const { data: userProgress } = await supabase
                    .from('user_missions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('mission_date', { ascending: false }); // Get latest first

                if (allMissions) {
                    // Merge - find the latest progress for each mission
                    const merged = allMissions.map(m => {
                        // Since we ordered by date desc, the first match is the latest
                        const prog = userProgress?.find(up => up.mission_id === m.id);
                        return {
                            ...m,
                            progress: prog?.progress || 0,
                            completed: prog?.completed || false,
                            claimed: prog?.claimed || false
                        };
                    });
                    setMissions(merged);

                    // Update Stats with Mission Data
                    const completedCount = merged.filter(m => m.completed).length;
                    const totalMissions = merged.length;

                    setStats(prev => ({
                        ...prev,
                        dailyMissionsComplete: completedCount,
                        totalDailyMissions: totalMissions // We might need to add this property to stats state if not present, checking...
                    }));
                }
            } catch (e) {
                console.error('Error fetching missions', e);
            }
        }
        fetchMissions();
    }, [user?.id]); // Re-fetch when user changes

    const claimWeeklyBonus = async () => {
        if (isLoading || stats.weeklyActiveDays < 7 || stats.weeklyBonusClaimed || !user?.id) return;
        setIsLoading(true);
        try {
            // Update profile: add XP and set claim date
            const { error } = await supabase.rpc('increment_xp', { amount: 500 });

            // Note: Since we don't have an RPC for this specifically yet, we might need a direct update
            // Using direct update for now
            const now = new Date().toISOString();

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    total_xp: stats.totalXP + 500,
                    last_weekly_bonus_claimed_at: now
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Optimistic update
            setStats(prev => ({
                ...prev,
                totalXP: prev.totalXP + 500,
                weeklyBonusClaimed: true
            }));

            alert("Bonus Claimed! +500 XP");

        } catch (error) {
            console.error("Error claiming bonus:", error);
            alert("Failed to claim bonus. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0E1113] p-4 md:p-8 lg:p-12 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-2">
                    Your Progress
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                    Track your growth, achievements, and relationship development
                </p>
            </div>

            <div className="max-w-5xl mx-auto w-full space-y-6">
                {/* Navigation Tabs */}
                <div className="flex items-center justify-between bg-[#1A1D21] p-1 rounded-xl border border-white/5 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'achievements', label: 'Achievements', icon: Trophy },
                        { id: 'missions', label: 'Missions', icon: Target },
                        { id: 'statistics', label: 'Statistics', icon: BarChart2 }
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isActive
                                    ? 'bg-[#1A1D21] border border-white/10 shadow-[0_0_20px_rgba(132,89,226,0.1)] text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                                    } relative`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#8459E2]/10 to-[#EC4899]/10 rounded-lg" />
                                )}
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-[#8459E2] to-[#EC4899]"></span>
                                )}
                                <tab.icon className="w-4 h-4" />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Sections */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Level Card */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-xl font-bold text-white">Level {stats.level}</h2>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase tracking-wide">
                                                Devoted Companion
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            <span className="text-white font-medium">{stats.totalXP.toLocaleString()} XP</span>
                                            <span className="mx-2">•</span>
                                            {stats.nextLevelXP.toLocaleString()} XP to next level
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-2xl font-bold text-white">{stats.totalXP.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Total XP</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Progress to Level {stats.level + 1}</span>
                                    <span>{Math.round(stats.xpProgress)}%</span>
                                </div>
                                <div className="h-2 bg-[#0E1113] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#8459E2] to-[#C27AFF] rounded-full shadow-[0_0_10px_#8459E2] transition-all duration-1000"
                                        style={{ width: `${stats.xpProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Quick Stats Grid within Card */}
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                                <div className="text-center border-r border-white/5 last:border-0">
                                    <div className="inline-flex p-2 rounded-lg bg-yellow-500/10 text-yellow-500 mb-2">
                                        <Star className="w-5 h-5" />
                                    </div>
                                    <div className="text-xl font-bold text-white mb-0.5">{stats.dailyXP}</div>
                                    <div className="text-xs text-gray-500">Daily XP</div>
                                </div>
                                <div className="text-center border-r border-white/5 last:border-0">
                                    <div className="inline-flex p-2 rounded-lg bg-blue-500/10 text-blue-500 mb-2">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div className="text-xl font-bold text-white mb-0.5">{stats.streak}</div>
                                    <div className="text-xs text-gray-500">Days Streak</div>
                                </div>
                                <div className="text-center">
                                    <div className="inline-flex p-2 rounded-lg bg-purple-500/10 text-purple-500 mb-2">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <div className="text-xl font-bold text-white mb-0.5">{stats.achievementsUnlocked}</div>
                                    <div className="text-xs text-gray-500">Achievements</div>
                                </div>
                            </div>
                        </div>

                        {/* Specific Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatBox
                                icon={<Heart className="w-5 h-5" />}
                                color="text-red-500"
                                bg="bg-red-500/10"
                                value={`${Math.round(stats.bondScore)}%`}
                                label="Bond Strength"
                            />
                            <StatBox
                                icon={<Star className="w-5 h-5" />}
                                color="text-yellow-500"
                                bg="bg-yellow-500/10"
                                value={`${Math.round(stats.bondScore + 10)}%`} // Placeholder logic for "Trust Level" > Bond for now
                                label="Trust Level"
                            />
                            <StatBox
                                icon={<MessageSquare className="w-5 h-5" />}
                                color="text-blue-500"
                                bg="bg-blue-500/10"
                                value={stats.messagesSent.toString()}
                                label="Messages Sent"
                            />
                            <StatBox
                                icon={<BookOpen className="w-5 h-5" />}
                                color="text-green-500"
                                bg="bg-green-500/10"
                                value="0" // Placeholder
                                label="Lessons Completed"
                            />
                        </div>

                        {/* Weekly Bonus */}
                        <div className="relative overflow-hidden bg-[#1A1D21] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group">
                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#8459E2]/5 rounded-full blur-[80px] group-hover:bg-[#8459E2]/10 transition-all duration-500"></div>

                            <div className="flex items-center gap-4 relative z-10 text-center md:text-left">
                                <div className="w-12 h-12 rounded-xl bg-[#8459E2]/20 border border-[#8459E2]/30 flex items-center justify-center text-[#C27AFF]">
                                    <Gift className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Weekly Bonuses Available!</h3>
                                    <p className="text-gray-400 text-sm">
                                        {stats.weeklyBonusClaimed
                                            ? "You claimed your weekly bonus! Come back next week."
                                            : `You've been active ${stats.weeklyActiveDays}/7 days this week. ${stats.weeklyActiveDays >= 7 ? "Claim your reward!" : "Keep it up!"}`
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={claimWeeklyBonus}
                                disabled={stats.weeklyActiveDays < 7 || stats.weeklyBonusClaimed}
                                className={`relative z-10 px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 whitespace-nowrap w-full md:w-auto transition-all
                                    ${stats.weeklyActiveDays >= 7 && !stats.weeklyBonusClaimed
                                        ? "bg-gradient-to-r from-[#8459E2] to-[#EC4899] hover:opacity-90 text-white cursor-pointer"
                                        : "bg-[#2A2D31] text-gray-500 cursor-not-allowed border border-white/5 opacity-50"
                                    }`}
                            >
                                {stats.weeklyBonusClaimed ? "Claimed" : "Claim +500 XP"}
                            </button>
                        </div>

                        {/* Recent Achievements */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-6 md:p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Recent Achievements
                            </h3>

                            <div className="space-y-4">
                                {achievements.length > 0 ? (
                                    achievements.slice(0, 3).map((ach) => (
                                        <AchievementRow
                                            key={ach.id}
                                            title={ach.title}
                                            description={ach.description}
                                            xp={ach.xp}
                                        />
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-center py-4 text-sm">
                                        No achievements unlocked yet. Start chatting to earn them!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                        <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            <div className="mb-3">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stats.achievementsUnlocked}</div>
                            <div className="text-sm text-gray-500">Unlocked</div>
                        </div>
                        <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            <div className="mb-3">
                                <Target className="w-6 h-6 text-[#35DDFE]" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stats.totalAchievements}</div>
                            <div className="text-sm text-gray-500">Total</div>
                        </div>
                        <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            <div className="mb-3">
                                <Star className="w-6 h-6 text-[#C27AFF]" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {Math.round((stats.achievementsUnlocked / (stats.totalAchievements || 1)) * 100)}%
                            </div>
                            <div className="text-sm text-gray-500">Complete</div>
                        </div>
                        <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            <div className="mb-3">
                                <Medal className="w-6 h-6 text-[#EC4899]" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stats.totalXP}</div>
                            <div className="text-sm text-gray-500">XP Earned</div>
                        </div>
                    </div>
                )}

                {activeTab === 'missions' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Todays Progress Card */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <CalendarCheck className="w-5 h-5 text-[#C27AFF]" />
                                <h3 className="text-lg font-bold text-white">Todays Progress</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-8">
                                Complete daily missions to earn XP and strengthen your bond
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">{stats.dailyMissionsComplete}/{missions.length || 3}</div>
                                    <div className="text-xs text-gray-400 font-medium">Daily Missions</div>
                                </div>
                                <div className="text-center border-l border-white/5 md:border-l-0 border-t md:border-t-0 pt-4 md:pt-0"> {/* Border handling for mobile */}
                                    <div className="text-2xl font-bold text-white mb-1">{stats.dailyXP}</div>
                                    <div className="text-xs text-gray-400 font-medium">XP Earned</div>
                                </div>
                                <div className="text-center border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-2xl font-bold text-white mb-1">{stats.streak}</div>
                                    <div className="text-xs text-gray-400 font-medium">Daily Streak</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8 relative">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Daily Progress</span>
                                    <span>{Math.round((stats.dailyMissionsComplete / (missions.length || 1)) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-[#2A2D31] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#8459E2] to-[#EC4899] transition-all duration-500"
                                        style={{ width: `${Math.round((stats.dailyMissionsComplete / (missions.length || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Success Banner */}
                            <div className="bg-[#1F2937]/50 border border-[#059669]/20 rounded-lg p-4 flex items-center gap-3">
                                <Gift className="w-5 h-5 text-[#10B981]" />
                                <span className="text-[#10B981] text-sm font-medium">Complete missions to unlock bonus XP!</span>
                            </div>
                        </div>

                        {/* Available Missions Header */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Available Missions</h3>
                            <div className="space-y-4">
                                {missions.length > 0 ? (
                                    missions.map((m) => (
                                        <MissionRow
                                            key={m.id}
                                            title={m.title}
                                            description={m.description}
                                            xp={m.xp_reward}
                                            progress={m.progress}
                                            target={m.target_value}
                                            completed={m.completed}
                                            claimed={m.claimed}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No missions available today.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'statistics' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Weekly Activity Chart */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 md:p-8">
                            <h3 className="text-lg font-bold text-white mb-1">Weekly Activity</h3>
                            <p className="text-gray-400 text-sm mb-8">
                                Your XP earning pattern over the last 7 days
                            </p>

                            <div className="grid grid-cols-7 gap-2 md:gap-4 items-end h-40"> {/* Fixed height for bars to grow from bottom */}
                                {(stats.chartData.length > 0 ? stats.chartData : [
                                    { day: 'Mon', val: 0, active: false },
                                    { day: 'Tue', val: 0, active: false },
                                    { day: 'Wed', val: 0, active: false },
                                    { day: 'Thu', val: 0, active: false },
                                    { day: 'Fri', val: 0, active: false },
                                    { day: 'Sat', val: 0, active: false },
                                    { day: 'Sun', val: 0, active: false },
                                ]).map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 group">
                                        {/* Bar */}
                                        <div className="w-full h-24 flex items-end justify-center">
                                            <div
                                                className={`w-full max-w-[60px] rounded-t-lg transition-all duration-500 ${item.active ? 'bg-gradient-to-t from-[#EC4899] to-[#EC4899]/80 h-3/4' : 'bg-[#2A2D31] h-2'}`}
                                            ></div>
                                        </div>
                                        {/* Label */}
                                        <div className="text-center">
                                            <div className="text-xs md:text-sm font-medium text-gray-300 mb-0.5">{item.day}</div>
                                            <div className="text-[10px] md:text-xs text-gray-500 font-bold">{item.val}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Conversation Stats */}
                            <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 md:p-8">
                                <h3 className="text-lg font-bold text-white mb-6">Conversation Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Total Messages</span>
                                        <span className="text-white font-bold">{stats.messagesSent}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Average Daily</span>
                                        <span className="text-white font-bold">{Math.round(stats.messagesSent / Math.max(1, stats.streak))}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Longest Session</span>
                                        <span className="text-white font-bold">--</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Favorite Time</span>
                                        <span className="text-white font-bold">--</span>
                                    </div>
                                </div>
                            </div>

                            {/* Learning Progress */}
                            <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-6 md:p-8">
                                <h3 className="text-lg font-bold text-white mb-6">Learning Progress</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Lessons Completed</span>
                                        <span className="text-white font-bold">0</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Certificates Earned</span>
                                        <span className="text-white font-bold">0</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Study Time</span>
                                        <span className="text-white font-bold">--</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm md:text-base">
                                        <span className="text-gray-400">Quick Average</span>
                                        <span className="text-white font-bold">--</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function StatBox({ icon, color, bg, value, label }: any) {
    return (
        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-[#1A1D21]/80 transition-colors group text-center">
            <div className={`mb-3 p-3 rounded-full ${bg} ${color} transition-colors`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</div>
        </div>
    )
}

function AchievementRow({ title, description, xp }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0E1113]/50 border border-white/5 hover:bg-[#0E1113] transition-colors">
            <div>
                <h4 className="font-bold text-white mb-0.5">{title}</h4>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                {xp}
            </div>
        </div>
    )
}

function MissionRow({ title, description, xp, progress, target, completed, claimed }: any) {
    const percent = Math.min(100, Math.round((progress / target) * 100));

    return (
        <div className="p-4 rounded-xl bg-[#0E1113]/50 border border-white/5 hover:bg-[#0E1113] transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h4 className="font-bold text-white mb-0.5">{title}</h4>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
                <div className={`px-3 py-1 rounded-lg border text-xs font-mono 
                    ${completed ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-gray-300 border-white/10'}`}>
                    {completed ? 'Completed' : `+${xp} XP`}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-[#2A2D31] rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${completed ? 'bg-green-500' : 'bg-[#8459E2]'}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-medium">
                <span>{progress} / {target}</span>
                <span>{percent}%</span>
            </div>
        </div>
    )
}
