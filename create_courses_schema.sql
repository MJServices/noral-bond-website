-- ============================================
-- Courses and Lessons Schema
-- ============================================

-- 1. Courses Table (Structured Paths)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT, -- e.g., 'Relationship', 'Safety'
    level TEXT, -- 'Beginner', 'Intermediate', 'Advanced'
    icon_key TEXT, -- String reference to Lucide icon (e.g., 'shield', 'heart')
    total_xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Lessons Table (Individual Units)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL, -- Nullable for "Individual Lessons"
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Markdown content for the lesson
    category TEXT, -- Redundant if in course, but useful for individual filtering
    level TEXT,
    duration_min INTEGER DEFAULT 15,
    xp_reward INTEGER DEFAULT 100,
    icon_key TEXT,
    order_index INTEGER DEFAULT 0, -- For ordering within a course
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Course Progress
CREATE TABLE IF NOT EXISTS public.user_course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0, -- Percentage 0-100
    is_completed BOOLEAN DEFAULT FALSE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 4. User Lesson Progress (Tracks individual completions)
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, lesson_id)
);

-- ============================================
-- RLS Policies (Security)
-- ============================================

-- Courses: Everyone can read
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public courses view" ON public.courses;
CREATE POLICY "Public courses view" ON public.courses FOR SELECT USING (true);

-- Lessons: Everyone can read
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public lessons view" ON public.lessons;
CREATE POLICY "Public lessons view" ON public.lessons FOR SELECT USING (true);

-- User Progress: Users can view/edit ONLY their own
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own course progress" ON public.user_course_progress;
CREATE POLICY "Users view own course progress" ON public.user_course_progress 
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own course progress" ON public.user_course_progress;
CREATE POLICY "Users update own course progress" ON public.user_course_progress 
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own lesson progress" ON public.user_lesson_progress;
CREATE POLICY "Users view own lesson progress" ON public.user_lesson_progress 
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own lesson progress" ON public.user_lesson_progress;
CREATE POLICY "Users update own lesson progress" ON public.user_lesson_progress 
    FOR ALL USING (auth.uid() = user_id);
