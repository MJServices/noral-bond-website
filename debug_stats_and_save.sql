-- 1. Check RLS Policies on profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 2. Check Triggers on messages table (for conversation count)
SELECT trigger_name, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'messages';

-- 3. Read the disabled functions to see if they are safe to re-enable
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('check_bond_achievements', 'update_streak_mission');
