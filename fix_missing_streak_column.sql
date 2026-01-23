-- ============================================
-- Fix Missing Streak Column
-- ============================================

-- The update_user_stats trigger references 'current_streak', but it is missing.
-- Adding it now.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
