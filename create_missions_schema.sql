-- ============================================
-- Missions System Schema
-- ============================================

-- 1. Mission Definitions
CREATE TABLE IF NOT EXISTS public.missions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 100,
    target_value INTEGER NOT NULL,
    mission_type TEXT NOT NULL CHECK (mission_type IN ('message_count', 'xp_earned', 'streak')), 
    icon_key TEXT DEFAULT 'star'
);

-- Seed Default Daily Missions
INSERT INTO public.missions (id, title, description, xp_reward, target_value, mission_type, icon_key) VALUES
('daily_msg_5', 'Chatterbox', 'Send 5 messages today', 50, 5, 'message_count', 'message-square'),
('daily_xp_100', 'XP Hunter', 'Earn 100 XP today', 100, 100, 'xp_earned', 'zap'),
('daily_streak_keep', 'Consistency', 'Maintain your streak', 50, 1, 'streak', 'calendar')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    xp_reward = EXCLUDED.xp_reward,
    target_value = EXCLUDED.target_value;

-- 2. User Mission Progress
CREATE TABLE IF NOT EXISTS public.user_missions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id TEXT REFERENCES public.missions(id),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    claimed BOOLEAN DEFAULT FALSE,
    mission_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, mission_id, mission_date)
);

-- RLS
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions" ON public.user_missions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own missions" ON public.user_missions
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.missions TO postgres, service_role, authenticated;
GRANT ALL ON public.user_missions TO postgres, service_role, authenticated;
