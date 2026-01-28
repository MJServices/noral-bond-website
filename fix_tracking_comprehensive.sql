-- ============================================
-- FIX: Comprehensive Tracking Repair
-- ============================================

-- 1. Ensure user_daily_activity is writable
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;

-- Allow INSERT/UPDATE for authenticated users (since the trigger runs as the user in some contexts or needs explicit policy)
-- Note: SECURITY DEFINER should bypass this, but sometimes RLS on the table OWNER can be tricky.
-- Let's be explicit:
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_daily_activity;
CREATE POLICY "Enable insert for authenticated users only" ON public.user_daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable update for users based on email" ON public.user_daily_activity;
CREATE POLICY "Enable update for users based on email" ON public.user_daily_activity FOR UPDATE USING (auth.uid() = user_id);

-- 2. CleanRecreate the Function
CREATE OR REPLACE FUNCTION public.track_daily_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or Update Daily Activity
    INSERT INTO public.user_daily_activity (user_id, activity_date, message_count, xp_earned)
    VALUES (NEW.user_id, CURRENT_DATE, 1, 10)
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET 
        message_count = user_daily_activity.message_count + 1,
        xp_earned = user_daily_activity.xp_earned + 10;
        
    -- Update Profile Total XP
    UPDATE public.profiles
    SET total_xp = COALESCE(total_xp, 0) + 10,
        last_active_at = NOW() -- Also update last_active
    WHERE id = NEW.user_id;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error (if we had a log table) or just ignore to prevent breaking chat
    -- RAISE WARNING 'Error in track_daily_activity: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Rebind Trigger
DROP TRIGGER IF EXISTS trigger_track_daily_activity ON public.messages;
CREATE TRIGGER trigger_track_daily_activity
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.track_daily_activity();

-- 4. Grant Permissions (Safe measure)
GRANT ALL ON public.user_daily_activity TO postgres;
GRANT ALL ON public.user_daily_activity TO service_role;
GRANT ALL ON public.user_daily_activity TO authenticated;
