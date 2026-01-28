-- Inspect secondary trigger functions
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('check_bond_achievements', 'update_streak_mission');

-- Check if the main trigger exists on auth.users (using pg_trigger directly as it is more reliable for system schemas)
SELECT tgname, tgrelid::regclass
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
