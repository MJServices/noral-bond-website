-- Extended Progress Tracking Schema

-- 1. Add XP and Streak columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_streak_date DATE;

-- 2. Create user_daily_activity table for granular tracking
CREATE TABLE IF NOT EXISTS public.user_daily_activity (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE DEFAULT CURRENT_DATE,
    xp_earned INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own activity
CREATE POLICY "Users can view their own activity"
ON public.user_daily_activity FOR SELECT
USING (auth.uid() = user_id);

-- 3. Simplified Achievements Table (for future extensibility)
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 100,
    icon_key TEXT
);

-- 4. User Achievements (Unlocked)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, achievement_id)
);

-- RLS for achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

-- Insert some default achievements
INSERT INTO public.achievements (id, title, description, xp_reward, icon_key) VALUES
('first_chat', 'First Steps', 'Send your first message', 100, 'message-square'),
('trust_builder', 'Trust Builder', 'Reach 50% Bond Score', 500, 'heart'),
('level_10', 'Level Up', 'Reach Level 10', 1000, 'trophy')
ON CONFLICT (id) DO NOTHING;
