-- Check Activity (Simple Version)
-- Run this to see if any activity was recorded today.

SELECT 
    u.email, 
    da.activity_date, 
    da.message_count, 
    da.xp_earned 
FROM public.user_daily_activity da
JOIN auth.users u ON u.id = da.user_id
WHERE da.activity_date = CURRENT_DATE;
