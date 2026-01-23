-- ============================================
-- Setup Progress Tracking Tables & Data
-- ============================================

-- 1. Ensure Profiles has needed columns (redundant check, but safe)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_streak_date DATE;

-- 2. User Daily Activity
CREATE TABLE IF NOT EXISTS public.user_daily_activity (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE DEFAULT CURRENT_DATE,
    xp_earned INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, activity_date)
);

ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_daily_activity' AND policyname = 'Users can view their own activity') THEN
        CREATE POLICY "Users can view their own activity" ON public.user_daily_activity FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;


-- 3. Achievements Definitions
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 100,
    icon_key TEXT
);

-- Seed Achievements
INSERT INTO public.achievements (id, title, description, xp_reward, icon_key) VALUES
('first_chat', 'First Steps', 'Send your first message', 100, 'message-square'),
('trust_builder', 'Trust Builder', 'Reach 50% Bond Score', 500, 'heart'),
('level_10', 'Level Up', 'Reach Level 10', 1000, 'trophy'),
('dedication', 'Dedication', 'Maintain a 7-day streak', 500, 'zap'),
('curious_mind', 'Curious Mind', 'Ask 50 questions', 250, 'brain')
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    xp_reward = EXCLUDED.xp_reward,
    icon_key = EXCLUDED.icon_key;


-- 4. User Achievements (Unlocked)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'Users can view their own achievements') THEN
        CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Trigger to Auto-Unlock "First Steps"
CREATE OR REPLACE FUNCTION public.check_first_message_achievement()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user already has the achievement
    IF NOT EXISTS (
        SELECT 1 FROM public.user_achievements 
        WHERE user_id = NEW.user_id AND achievement_id = 'first_chat'
    ) THEN
        -- Unlock it
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (NEW.user_id, 'first_chat');
        
        -- Award XP
        UPDATE public.profiles
        SET total_xp = COALESCE(total_xp, 0) + 100
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_first_message_achievement ON public.messages;
CREATE TRIGGER trigger_first_message_achievement
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.check_first_message_achievement();

-- 6. Trigger to Auto-Unlock "Trust Builder" (50% Bond)
CREATE OR REPLACE FUNCTION public.check_bond_achievements()
RETURNS TRIGGER AS $$
BEGIN
    -- Trust Builder (50% Bond)
    IF NEW.bond_score >= 50 AND NOT EXISTS (
        SELECT 1 FROM public.user_achievements 
        WHERE user_id = NEW.id AND achievement_id = 'trust_builder'
    ) THEN
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (NEW.id, 'trust_builder');
        
        UPDATE public.profiles SET total_xp = COALESCE(total_xp, 0) + 500 WHERE id = NEW.id;
    END IF;

    -- Level 10
    IF NEW.level >= 10 AND NOT EXISTS (
        SELECT 1 FROM public.user_achievements 
        WHERE user_id = NEW.id AND achievement_id = 'level_10'
    ) THEN
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (NEW.id, 'level_10');
        
        UPDATE public.profiles SET total_xp = COALESCE(total_xp, 0) + 1000 WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_bond_achievements ON public.profiles;
CREATE TRIGGER trigger_bond_achievements
    AFTER UPDATE OF bond_score, level ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_bond_achievements();
