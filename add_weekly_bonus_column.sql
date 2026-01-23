-- ============================================
-- Add Weekly Bonus Tracking
-- ============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_weekly_bonus_claimed_at TIMESTAMP WITH TIME ZONE;
