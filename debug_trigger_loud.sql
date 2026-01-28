-- ============================================
-- DEBUG: Loud Trigger (No Error Swallowing)
-- ============================================

CREATE OR REPLACE FUNCTION public.track_daily_activity()
RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'Trigger started for user: %', NEW.user_id;

    -- Insert or Update Daily Activity
    INSERT INTO public.user_daily_activity (user_id, activity_date, message_count, xp_earned)
    VALUES (NEW.user_id, CURRENT_DATE, 1, 10)
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET 
        message_count = user_daily_activity.message_count + 1,
        xp_earned = user_daily_activity.xp_earned + 10;
        
    RAISE NOTICE 'Activity updated/inserted';

    -- Update Profile Total XP
    UPDATE public.profiles
    SET total_xp = COALESCE(total_xp, 0) + 10,
        last_active_at = NOW() 
    WHERE id = NEW.user_id;
    
    RAISE NOTICE 'Profile updated';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Removed EXCEPTION block so errors will surface!
