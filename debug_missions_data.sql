-- Debug Mission Data
SELECT id, email, current_streak, last_streak_date, total_xp FROM public.profiles;

SELECT * FROM public.user_daily_activity WHERE activity_date = CURRENT_DATE;

SELECT * FROM public.user_missions WHERE mission_date = CURRENT_DATE;

-- Check mission definitions
SELECT * FROM public.missions;
