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

export default function ProgressPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        level: 1,
        totalXP: 0,
        nextLevelXP: 1000,
        xpProgress: 0,
        dailyXP: 0,
        streak: 0,
        bondScore: 0,
        messagesSent: 0,
        achievementsUnlocked: 0,
        totalAchievements: 5,
        dailyMissionsComplete: 0,
        weeklyActiveDays: 0,
        weeklyBonusClaimed: false
    });

    const [achievements, setAchievements] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        async function fetchProgress() {
            try {
                // 1. Fetch Profile Stats
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('level, total_xp, bond_score, current_streak, conversations_count, last_weekly_bonus_claimed_at')
                    .eq('id', user!.id)
                    .maybeSingle();

                // 2. Fetch User Daily Activity for today
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                const { data: dailyActivity } = await supabase
                    .from('user_daily_activity')
                    .select('xp_earned')
                    .eq('user_id', user!.id)
                    .eq('activity_date', todayStr)
                    .maybeSingle();

                // Fetch activity for last 7 days for Weekly Bonus
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 6);
                const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

                const { count: activeDaysCount } = await supabase
                    .from('user_daily_activity')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user!.id)
                    .gte('activity_date', sevenDaysAgoStr);

                // Check if bonus was claimed in the last 7 days
                let bonusClaimedRecently = false;
                if (profile?.last_weekly_bonus_claimed_at) {
                    const lastClaimDate = new Date(profile.last_weekly_bonus_claimed_at);
                    if (lastClaimDate >= sevenDaysAgo) {
                        bonusClaimedRecently = true;
                    }
                }

                // 3. Fetch Achievements
                const { data: userAchievements, count: unlockedCount } = await supabase
                    .from('user_achievements')
                    .select('achievement_id, unlocked_at, achievements(title, description, xp_reward)', { count: 'exact' })
                    .eq('user_id', user!.id);

                const { count: totalAchievementsCount } = await supabase
                    .from('achievements')
                    .select('*', { count: 'exact', head: true });

                // Calculate calculations
                const currentLevel = profile?.level || 1;
                const totalXP = profile?.total_xp || 0;
                const xpPerLevel = 1000;
                const prevLevelThreshold = (currentLevel - 1) * 1000;
                const currentLevelProgress = totalXP - prevLevelThreshold;
                const progressPercent = Math.min(100, Math.max(0, (currentLevelProgress / xpPerLevel) * 100));

                setStats({
                    level: currentLevel,
                    totalXP: totalXP,
                    nextLevelXP: xpPerLevel - currentLevelProgress,
                    xpProgress: progressPercent,
                    dailyXP: dailyActivity?.xp_earned || 0,
                    streak: profile?.current_streak || 0,
                    bondScore: profile?.bond_score || 0,
                    messagesSent: profile?.conversations_count || 0,
                    achievementsUnlocked: unlockedCount || 0,
                    totalAchievements: totalAchievementsCount || 5,
                    dailyMissionsComplete: 0,
                    weeklyActiveDays: activeDaysCount || 0,
                    weeklyBonusClaimed: bonusClaimedRecently
                });

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

        fetchProgress();
    }, [user?.id]);

    const claimWeeklyBonus = async () => {
        if (isLoading || stats.weeklyActiveDays < 7 || stats.weeklyBonusClaimed) return;
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
                .eq('id', user!.id);

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
                                    <div className="text-2xl font-bold text-white mb-1">0/3</div>
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
                                    <span>0%</span>
                                </div>
                                <div className="h-2 bg-[#2A2D31] rounded-full overflow-hidden">
                                    <div className="h-full w-0 bg-[#2A2D31]" />
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
                            <h3 className="text-lg font-bold text-white">Available Missions</h3>
                            <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
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
                                {[
                                    { day: 'Mon', val: 0, active: false },
                                    { day: 'Tue', val: 0, active: false },
                                    { day: 'Wed', val: stats.dailyXP, active: stats.dailyXP > 0 },
                                    { day: 'Thu', val: 0, active: false },
                                    { day: 'Fri', val: 0, active: false },
                                    { day: 'Sat', val: 0, active: false },
                                    { day: 'Sun', val: 0, active: false },
                                ].map((item, i) => (
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
