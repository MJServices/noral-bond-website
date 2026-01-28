-- Check RLS Policies
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename IN ('user_daily_activity', 'user_missions', 'missions');
