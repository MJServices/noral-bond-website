-- Debug Messages & Trigger
-- 1. Check messages columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'messages';

-- 2. Check if trigger exists
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'messages';

-- 3. Check Policies on user_daily_activity
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'user_daily_activity';

-- 4. Check if we have any data in user_daily_activity for today
SELECT * FROM public.user_daily_activity WHERE activity_date = CURRENT_DATE;
