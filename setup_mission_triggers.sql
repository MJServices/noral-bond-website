-- ============================================
-- Mission Progress Trigger
-- ============================================

CREATE OR REPLACE FUNCTION public.update_mission_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- This trigger runs on user_daily_activity updates/inserts

    -- 1. Message Count Mission
    -- Check if mission exists first to avoid errors if seeded data is missing
    IF EXISTS (SELECT 1 FROM public.missions WHERE id = 'daily_msg_5') THEN
        INSERT INTO public.user_missions (user_id, mission_id, progress, mission_date, completed)
        VALUES (NEW.user_id, 'daily_msg_5', NEW.message_count, NEW.activity_date, NEW.message_count >= 5)
        ON CONFLICT (user_id, mission_id, mission_date)
        DO UPDATE SET 
            progress = EXCLUDED.progress,
            completed = (EXCLUDED.progress >= 5),
            updated_at = NOW();
    END IF;

    -- 2. XP Earned Mission
    IF EXISTS (SELECT 1 FROM public.missions WHERE id = 'daily_xp_100') THEN
        INSERT INTO public.user_missions (user_id, mission_id, progress, mission_date, completed)
        VALUES (NEW.user_id, 'daily_xp_100', NEW.xp_earned, NEW.activity_date, NEW.xp_earned >= 100)
        ON CONFLICT (user_id, mission_id, mission_date)
        DO UPDATE SET 
            progress = EXCLUDED.progress,
            completed = (EXCLUDED.progress >= 100),
            updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on Daily Activity
DROP TRIGGER IF EXISTS trigger_update_missions ON public.user_daily_activity;
CREATE TRIGGER trigger_update_missions
    AFTER INSERT OR UPDATE ON public.user_daily_activity
    FOR EACH ROW
    EXECUTE FUNCTION public.update_mission_progress();


-- Trigger for Streak (on profiles update)
CREATE OR REPLACE FUNCTION public.update_streak_mission()
RETURNS TRIGGER AS $$
BEGIN
    -- If streak > 0, mark as done
    IF NEW.current_streak > 0 THEN
        INSERT INTO public.user_missions (user_id, mission_id, progress, mission_date, completed)
        VALUES (NEW.id, 'daily_streak_keep', 1, CURRENT_DATE, TRUE)
        ON CONFLICT (user_id, mission_id, mission_date)
        DO UPDATE SET 
            progress = 1,
            completed = TRUE,
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_streak_mission ON public.profiles;
CREATE TRIGGER trigger_streak_mission
    AFTER UPDATE OF current_streak ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_streak_mission();
