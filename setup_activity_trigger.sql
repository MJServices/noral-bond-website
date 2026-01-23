-- ============================================
-- Add Daily Activity Tracking Trigger
-- ============================================

CREATE OR REPLACE FUNCTION public.track_daily_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_daily_activity (user_id, activity_date, message_count, xp_earned)
    VALUES (NEW.user_id, CURRENT_DATE, 1, 10) -- 10 XP per message example
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET 
        message_count = user_daily_activity.message_count + 1,
        xp_earned = user_daily_activity.xp_earned + 10;
        
    -- Update Profile Total XP as well
    UPDATE public.profiles
    SET total_xp = COALESCE(total_xp, 0) + 10
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_track_daily_activity ON public.messages;
CREATE TRIGGER trigger_track_daily_activity
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.track_daily_activity();
