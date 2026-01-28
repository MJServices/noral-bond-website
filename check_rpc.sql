-- Check if the RPC function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'check_daily_activity';
