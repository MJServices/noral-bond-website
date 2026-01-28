-- 1. Fix Missions Visibility (RLS)
-- Allow anyone to read the mission definitions
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public missions are viewable by everyone" ON public.missions;
CREATE POLICY "Public missions are viewable by everyone" 
ON public.missions FOR SELECT 
USING (true);


-- 2. Recalculate Streak for User 'ayancoder8'
-- (Simple logic: just count active days for now as a baseline, or set to 1 since they are active today)
-- Real streak calculation is complex in SQL, so we'll just set it to matching days_active or 1 for now to "unblock" the display.

UPDATE public.profiles
SET current_streak = (
    SELECT count(DISTINCT activity_date) 
    FROM public.user_daily_activity 
    WHERE user_id = '1eefb9bf-7b85-475d-a756-d92b886133e5' -- User ID
)
WHERE id = '1eefb9bf-7b85-475d-a756-d92b886133e5';

-- Verify results
SELECT count(*) as missions_count FROM public.missions;
SELECT current_streak FROM public.profiles WHERE id = '1eefb9bf-7b85-475d-a756-d92b886133e5';
