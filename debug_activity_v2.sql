-- Debug Messages & Trigger (V2)
-- 1. Check message count for today
SELECT count(*) as messages_today FROM public.messages 
WHERE created_at >= CURRENT_DATE;

-- 2. Check user_daily_activity for today
SELECT * FROM public.user_daily_activity 
WHERE activity_date = CURRENT_DATE;

-- 3. Force Trigger Recreation (if previous failed silently)
DROP TRIGGER IF EXISTS trigger_track_daily_activity ON public.messages;
CREATE TRIGGER trigger_track_daily_activity
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.track_daily_activity();
