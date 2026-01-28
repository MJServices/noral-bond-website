-- Check ALL recent activity (to identify day rollover issues)
-- Shows the last 10 activity records for ANY date.

SELECT 
    da.activity_date, 
    da.message_count, 
    da.xp_earned, 
    u.email
FROM public.user_daily_activity da
JOIN auth.users u ON u.id = da.user_id
ORDER BY da.activity_date DESC, da.xp_earned DESC
LIMIT 10;

-- Also check messages Sent "Today" (UTC)
SELECT count(*) as messages_sent_utc_today 
FROM public.messages 
WHERE created_at >= CURRENT_DATE;

-- Check User Missions for "Today" (UTC)
SELECT * FROM public.user_missions 
WHERE mission_date = CURRENT_DATE;
