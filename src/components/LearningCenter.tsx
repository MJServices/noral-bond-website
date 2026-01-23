'use client';

import {
    BookOpen,
    Clock,
    Star,
    CheckCircle,
    Search,
    ChevronDown,
    Shield,
    User,
    Users,
    Layout,
    Lock,
    PlayCircle,
    Lightbulb,
    Trophy
} from 'lucide-react';
import { useState } from 'react';

export default function LearningCenter() {
    const [activeTab, setActiveTab] = useState('individual');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex flex-col min-h-screen bg-[#0E1113] p-4 md:p-8 lg:p-12 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-3">
                    Learning Center
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                    Expand your knowledge with expert-designed courses and interactive lessons
                </p>
            </div>

            <div className="max-w-6xl mx-auto w-full space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        icon={<BookOpen className="w-5 h-5 text-[#C27AFF]" />}
                        value="2"
                        label="Completed"
                        bg="bg-[#1A1D21]"
                    />
                    <StatsCard
                        icon={<Clock className="w-5 h-5 text-[#35DDFE]" />}
                        value="2"
                        label="In Progress"
                        bg="bg-[#1A1D21]"
                    />
                    <StatsCard
                        icon={<Star className="w-5 h-5 text-[#F59E0B]" />}
                        value="500"
                        label="XP Earned"
                        bg="bg-[#1A1D21]"
                    />
                    <StatsCard
                        icon={<CheckCircle className="w-5 h-5 text-[#EC4899]" />}
                        value="25%"
                        label="Complete"
                        bg="bg-[#1A1D21]"
                    />
                </div>

                {/* Tab Navigation & Filters */}
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex p-1 bg-[#1A1D21] border border-white/5 rounded-xl max-w-2xl mx-auto">
                        <button
                            onClick={() => setActiveTab('individual')}
                            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'individual' ? 'bg-[#2A2D31] text-white shadow-lg' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Individual Lessons
                        </button>
                        <button
                            onClick={() => setActiveTab('structured')}
                            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'structured' ? 'bg-[#2A2D31] text-white shadow-lg' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <Layout className="w-4 h-4" />
                            Structured Courses
                        </button>
                    </div>

                    {/* Search Bar - Only show on individual lessons tab if that was the intent, but user didn't specify. 
                        Usually structured courses might not need search or have own search. 
                        In the screenshot for Structured Courses, there is NO search bar visible above the card.
                        So I will wrap existing content in activeTab === 'individual'
                    */}
                </div>

                {/* Tab Content */}
                {activeTab === 'individual' ? (
                    <div className="space-y-8 animate-fade-in">
                        {/* Search Bar */}
                        <div className="bg-[#1A1D21] p-6 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <Search className="w-4 h-4 text-white" />
                                <span className="font-bold text-white">Find Lessons</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Search Lessons..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#0E1113] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-[#8459E2] transition-colors"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0E1113] border border-white/10 rounded-lg text-sm text-gray-400 min-w-[160px]">
                                        All Categories
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <button className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0E1113] border border-white/10 rounded-lg text-sm text-gray-400 min-w-[140px]">
                                        All Levels
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lesson Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <LessonCard
                                title="Understanding Consent"
                                category="Safety"
                                level="Beginner"
                                levelColor="text-green-400 bg-green-400/10 border-green-400/20"
                                description="Learn the fundamentals of clear, ongoing consent and how to create safe spaces for all interactions."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<Shield className="w-5 h-5 text-blue-400" />}
                                iconBg="bg-blue-400/10 border-blue-400/20"
                                action="Review"
                                isCompleted={true}
                            />
                            <LessonCard
                                title="Effective Communication"
                                category="Communication"
                                level="Beginner"
                                levelColor="text-green-400 bg-green-400/10 border-green-400/20"
                                description="Master the art of expressing needs, desires, and boundaries clearly and respectfully."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<User className="w-5 h-5 text-[#8459E2]" />}
                                iconBg="bg-[#8459E2]/10 border-[#8459E2]/20"
                                action="Continue"
                                progress={50}
                            />
                            <LessonCard
                                title="Emotional Intelligence"
                                category="Psychology"
                                level="Intermediate"
                                levelColor="text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                                description="Develop deeper self-awareness and empathy to enhance your emotional connections."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<BookOpen className="w-5 h-5 text-blue-400" />}
                                iconBg="bg-blue-400/10 border-blue-400/20"
                                action="Continue"
                                isNext={true}
                            />
                            <LessonCard
                                title="Building Trust & Intimacy"
                                category="Relationship"
                                level="Intermediate"
                                levelColor="text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                                description="Explore techniques for developing deep trust and authentic intimacy in relationships."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<Users className="w-5 h-5 text-[#8459E2]" />}
                                iconBg="bg-[#8459E2]/10 border-[#8459E2]/20"
                                action="Continue"
                                isNext={true}
                            />
                            <LessonCard
                                title="Setting Healthy Boundaries"
                                category="Safety"
                                level="Beginner"
                                levelColor="text-green-400 bg-green-400/10 border-green-400/20"
                                description="Learn to establish, communicate, and maintain personal boundaries effectively."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<User className="w-5 h-5 text-green-400" />} // Icon color seems different in screenshot, simplified
                                iconBg="bg-green-400/10 border-green-400/20"
                                action="Continue"
                                progress={50}
                            />
                            <LessonCard
                                title="Understanding Power Dynamics"
                                category="Relationship"
                                level="Advanced"
                                levelColor="text-red-400 bg-red-400/10 border-red-400/20"
                                description="Explore healthy power exchange and maintaining balance in dynamic relationships."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<Lock className="w-5 h-5 text-gray-400" />}
                                iconBg="bg-gray-400/10 border-gray-400/20"
                                action="Locked"
                                isLocked={true}
                            />
                            <LessonCard
                                title="Aftercare Fundamentals"
                                category="Safety"
                                level="Intermediate"
                                levelColor="text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                                description="Essential knowledge about providing and receiving care after intense experiences."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<Shield className="w-5 h-5 text-blue-400" />}
                                iconBg="bg-blue-400/10 border-blue-400/20"
                                action="Continue"
                                isNext={true}
                            />
                            <LessonCard
                                title="Mindful Intimacy"
                                category="Psychology"
                                level="Beginner"
                                levelColor="text-green-400 bg-green-400/10 border-green-400/20"
                                description="Practice being present and mindful during intimate moments and conversations."
                                duration="15 min"
                                rating="4.9"
                                users="12,127"
                                xp="+200 XP"
                                icon={<BookOpen className="w-5 h-5 text-green-400" />}
                                iconBg="bg-green-400/10 border-green-400/20"
                                action="Review"
                                isCompleted={true}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Learning Process Card */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-5 h-5 text-[#8459E2]" />
                                <h3 className="text-lg font-bold text-white">Learning Process</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-8">
                                Your journey through educational courses and certifications
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-b border-white/5 pb-8">
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <Trophy className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">2</div>
                                    <div className="text-xs text-gray-500">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <div className="w-6 h-6 rounded-full border-2 border-[#35DDFE] flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#35DDFE] rounded-full" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">0</div>
                                    <div className="text-xs text-gray-500">Enrolled</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <Lightbulb className="w-6 h-6 text-[#EC4899]" />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">0</div>
                                    <div className="text-xs text-gray-500">Certificates</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <Star className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">0%</div>
                                    <div className="text-xs text-gray-500">Average Progress</div>
                                </div>
                            </div>

                            {/* Overall Progress Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Overall Progress</span>
                                    <span>0%</span>
                                </div>
                                <div className="h-2 bg-[#0E1113] rounded-full overflow-hidden">
                                    <div className="h-full w-0 bg-[#2A2D31]" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatsCard({ icon, value, label, bg }: any) {
    return (
        <div className={`${bg} border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors`}>
            <div className="mb-3 p-3 rounded-full bg-white/5">
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
}

function LessonCard({
    title, category, level, levelColor, description, duration, rating, users, xp, icon, iconBg, action, progress, isCompleted, isLocked, isNext
}: any) {
    return (
        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 flex flex-col h-full hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${iconBg} border flex items-center justify-center`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-2 leading-tight min-h-[40px]">{title}</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${levelColor}`}>
                                {level}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                {category}
                            </span>
                        </div>
                    </div>
                </div>
                {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>

            <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                {description}
            </p>

            <div className="flex items-center gap-4 text-[10px] text-gray-500 font-medium mb-6">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{duration}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{rating}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{users}</span>
                </div>
            </div>

            {/* Progress Bar only if progress is defined */}
            {typeof progress === 'number' && (
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#0E1113] rounded-full overflow-hidden">
                        <div style={{ width: `${progress}%` }} className="h-full bg-[#8459E2] rounded-full" />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mt-auto">
                <span className="text-[#8459E2] text-xs font-bold">{xp}</span>

                {isLocked ? (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                    </div>
                ) : isCompleted ? (
                    <button className="px-4 py-1.5 rounded-lg border border-[#10B981] text-[#10B981] text-xs font-bold hover:bg-[#10B981]/10 flex items-center gap-2 transition-colors">
                        <BookOpen className="w-3 h-3" />
                        Review
                    </button>
                ) : isNext ? (
                    <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#EC4899] to-[#EC4899] hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-opacity">
                        Continue
                    </button>
                ) : ( // Default 'Continue' for in-progress
                    <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#8459E2] to-[#C27AFF] hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-opacity">
                        Continue
                    </button>
                )}
            </div>
        </div>
    );
}
