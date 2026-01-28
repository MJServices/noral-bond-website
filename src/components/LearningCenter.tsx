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
    Trophy,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';

// Types matching DB Schema
interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    icon_key: string;
    total_xp: number;
}

interface Lesson {
    id: string;
    course_id: string | null;
    title: string;
    description: string;
    content: string;
    category: string;
    level: string;
    duration_min: number;
    xp_reward: number;
    icon_key: string;
    is_completed?: boolean; // From join
    progress?: number;
}

export default function LearningCenter() {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('individual');
    const [searchQuery, setSearchQuery] = useState('');

    // Data State
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Viewer State
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchContent();
        }
    }, [user?.id]); // FIX: Only re-run if ID changes, not the whole object

    const handleCompleteLesson = async () => {
        if (!selectedLesson || !user) return;

        setSubmitting(true);
        try {
            // 1. Mark as complete in DB
            const { error } = await supabase
                .from('user_lesson_progress')
                .upsert({
                    user_id: user.id,
                    lesson_id: selectedLesson.id,
                    completed: true,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id,lesson_id' });

            if (error) throw error;

            // 2. Update Local State (Optimistic UI)
            setLessons(prev => prev.map(l =>
                l.id === selectedLesson.id ? { ...l, is_completed: true } : l
            ));

            // Close modal
            setSelectedLesson(null);

            // Optional: Trigger a toast or sound could go here

        } catch (err) {
            console.error('Error completing lesson:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Enrollment State
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());

    const handleEnroll = async (courseId: string) => {
        if (!user || !profile) return;

        // 1. Check Limits
        const currentEnrollments = enrolledCourseIds.size;
        let limit = 0; // Free
        if (profile.subscription_tier === 'standard') limit = 5;
        if (profile.subscription_tier === 'premium') limit = -1; // Unlimited

        if (limit !== -1 && currentEnrollments >= limit) {
            if (limit === 0) {
                alert("AI Courses are locked for Free users. Please upgrade to enroll.");
            } else {
                alert(`You have reached your limit of ${limit} active courses. Please upgrade to Premium for unlimited access.`);
            }
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('user_course_enrollments')
                .insert({
                    user_id: user.id,
                    course_id: courseId
                });

            if (error) throw error;

            // Update local state
            setEnrolledCourseIds(prev => new Set(prev).add(courseId));
            alert("Successfully enrolled in course!");

        } catch (error) {
            console.error('Error enrolling:', error);
            alert("Failed to enroll. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchContent = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 0. Fetch Enrollments
            const { data: enrollmentData } = await supabase
                .from('user_course_enrollments')
                .select('course_id')
                .eq('user_id', user.id);

            if (enrollmentData) {
                setEnrolledCourseIds(new Set(enrollmentData.map(e => e.course_id)));
            }

            // 1. Fetch Individual Lessons (activeTab 'individual')
            // Get lessons where course_id is NULL
            // Also join with user_lesson_progress to see if completed
            const { data: lessonsData, error: lessonsError } = await supabase
                .from('lessons')
                .select(`
                    *,
                    user_lesson_progress(completed)
                `)
                .is('course_id', null)
                .order('created_at', { ascending: true });

            if (lessonsError) console.error('Error fetching lessons:', lessonsError);

            // Transform to include 'is_completed' flag
            if (lessonsData) {
                const formattedLessons = lessonsData.map((l: any) => ({
                    ...l,
                    is_completed: l.user_lesson_progress?.[0]?.completed || false
                }));
                setLessons(formattedLessons);
            }

            // 2. Fetch Structured Courses
            const { data: coursesData, error: coursesError } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: true });

            if (coursesError) console.error('Error fetching courses:', coursesError);
            if (coursesData) setCourses(coursesData);

        } catch (error) {
            console.error('Error in fetchContent:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (key: string, className: string) => {
        switch (key) {
            case 'shield': return <Shield className={className} />;
            case 'user': return <User className={className} />;
            case 'users': return <Users className={className} />;
            case 'book-open': return <BookOpen className={className} />;
            case 'lock': return <Lock className={className} />;
            case 'brain': return <Lightbulb className={className} />;
            case 'heart': return <Users className={className} />; // Fallback
            default: return <BookOpen className={className} />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return "text-green-400 bg-green-400/10 border-green-400/20";
            case 'intermediate': return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case 'advanced': return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        }
    };

    // Filtered Lessons
    const filteredLessons = lessons.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#0E1113] p-4 md:p-8 lg:p-12 overflow-y-auto relative">
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
                {/* Stats Grid - Placeholder static for now, can be made dynamic later */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        icon={<BookOpen className="w-5 h-5 text-[#C27AFF]" />}
                        value={lessons.filter(l => l.is_completed).length.toString()}
                        label="Completed Lessons"
                        bg="bg-[#1A1D21]"
                    />
                    <StatsCard
                        icon={<Clock className="w-5 h-5 text-[#35DDFE]" />}
                        value={lessons.length.toString()}
                        label="Total Lessons"
                        bg="bg-[#1A1D21]"
                    />
                    <StatsCard
                        icon={<Star className="w-5 h-5 text-[#F59E0B]" />}
                        value={courses.length.toString()}
                        label="Available Courses"
                        bg="bg-[#1A1D21]"
                    />
                    <StatsCard
                        icon={<CheckCircle className="w-5 h-5 text-[#EC4899]" />}
                        value={lessons.length > 0 ? Math.round((lessons.filter(l => l.is_completed).length / lessons.length) * 100) + '%' : '0%'}
                        label="Completion Rate"
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
                            </div>
                        </div>

                        {/* Lesson Grid (Dynamic) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-3 text-center text-gray-400 py-12">Loading lessons...</div>
                            ) : filteredLessons.length === 0 ? (
                                <div className="col-span-3 text-center text-gray-400 py-12">No lessons found matching your criteria.</div>
                            ) : (
                                filteredLessons.map((lesson) => (
                                    <LessonCard
                                        key={lesson.id}
                                        title={lesson.title}
                                        category={lesson.category}
                                        level={lesson.level}
                                        levelColor={getLevelColor(lesson.level)}
                                        description={lesson.description}
                                        duration={`${lesson.duration_min} min`}
                                        rating="4.9"
                                        users="1k+"
                                        xp={`+${lesson.xp_reward} XP`}
                                        icon={getIcon(lesson.icon_key, `w-5 h-5 text-white`)} // Simplified icon color usage
                                        iconBg="bg-white/10 border-white/20"
                                        action={lesson.is_completed ? "Review" : "Start"}
                                        isCompleted={lesson.is_completed}
                                        isLocked={!user || (profile?.subscription_tier === 'free' || !profile?.subscription_tier)}
                                        onAction={() => {
                                            if (!user || (profile?.subscription_tier === 'free' || !profile?.subscription_tier)) {
                                                alert("Upgrade to Standard or Premium to access AI Courses!");
                                                return;
                                            }
                                            setSelectedLesson(lesson);
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    // Structured Courses (Dynamic)
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {loading ? (
                            <div className="col-span-3 text-center text-gray-400 py-12">Loading courses...</div>
                        ) : (
                            courses.map(course => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    getIcon={getIcon}
                                    getLevelColor={getLevelColor}
                                    isEnrolled={enrolledCourseIds.has(course.id)}
                                    onEnroll={() => handleEnroll(course.id)}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Lesson Viewer Modal */}
            {selectedLesson && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1A1D21] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedLesson.title}</h2>
                                <div className="flex gap-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getLevelColor(selectedLesson.level)}`}>
                                        {selectedLesson.level}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                        {selectedLesson.category}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="p-6 overflow-y-auto flex-1 text-gray-300 prose prose-invert max-w-none">
                            <ReactMarkdown>
                                {selectedLesson.content.replace(/\\n/g, '\n')}
                            </ReactMarkdown>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-white/5 bg-[#141619] flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCompleteLesson}
                                disabled={submitting}
                                className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting ? 'Saving...' : 'Complete & Earn XP'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
    title, category, level, levelColor, description, duration, rating, users, xp, icon, iconBg, action, progress, isCompleted, isLocked, isNext, onAction
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
                {/* <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{users}</span>
                </div> */}
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
                    <button
                        onClick={onAction}
                        className="px-4 py-1.5 rounded-lg border border-[#10B981] text-[#10B981] text-xs font-bold hover:bg-[#10B981]/10 flex items-center gap-2 transition-colors"
                    >
                        <BookOpen className="w-3 h-3" />
                        Review
                    </button>
                ) : ( // Default 'Start' / 'Continue'
                    <button
                        onClick={onAction}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#8459E2] to-[#C27AFF] hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-opacity"
                    >
                        {action}
                    </button>
                )}
            </div>
        </div>
    );
}

function CourseCard({ course, getIcon, getLevelColor, isEnrolled, onEnroll }: any) {
    return (
        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 flex flex-col h-full hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center`}>
                        {getIcon(course.icon_key, "w-5 h-5 text-white")}
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-2 leading-tight">{course.title}</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getLevelColor(course.level)}`}>
                                {course.level}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                {course.category}
                            </span>
                        </div>
                    </div>
                </div>
                {isEnrolled && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                {course.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
                <span className="text-[#8459E2] text-xs font-bold">Total XP: +{course.total_xp}</span>
                {isEnrolled ? (
                    <button className="px-4 py-1.5 rounded-lg border border-[#10B981] text-[#10B981] text-xs font-bold hover:bg-[#10B981]/10 flex items-center gap-2 transition-colors cursor-default">
                        Enrolled
                    </button>
                ) : (
                    <button
                        onClick={onEnroll}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#35DDFE] to-[#35DDFE] hover:opacity-90 text-black text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-opacity"
                    >
                        Enroll
                    </button>
                )}
            </div>
        </div>
    )
}
