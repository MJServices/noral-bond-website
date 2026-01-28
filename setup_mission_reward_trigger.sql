-- ============================================
-- Mission Reward Trigger
-- ============================================

CREATE OR REPLACE FUNCTION public.award_mission_xp()
RETURNS TRIGGER AS $$
DECLARE
    reward_amount INTEGER;
BEGIN
    -- Check if mission just became completed
    -- (Handle both INSERT and UPDATE cases where it flips to true)
    IF (TG_OP = 'INSERT' AND NEW.completed = TRUE) OR 
       (TG_OP = 'UPDATE' AND NEW.completed = TRUE AND OLD.completed = FALSE) THEN
        
        -- Get the reward amount
        SELECT xp_reward INTO reward_amount
        FROM public.missions
        WHERE id = NEW.mission_id;

        IF reward_amount IS NOT NULL AND reward_amount > 0 THEN
            -- 1. Update Profile Total XP
            UPDATE public.profiles
            SET total_xp = COALESCE(total_xp, 0) + reward_amount
            WHERE id = NEW.user_id;

            -- 2. Update Daily Activity XP
            -- This ensures "XP Earned" on the dashboard reflects the bonus too
            INSERT INTO public.user_daily_activity (user_id, activity_date, xp_earned, message_count)
            VALUES (NEW.user_id, NEW.mission_date, reward_amount, 0)
            ON CONFLICT (user_id, activity_date)
            DO UPDATE SET 
                xp_earned = user_daily_activity.xp_earned + reward_amount;
                
            RAISE NOTICE 'Awarded % XP for mission %', reward_amount, NEW.mission_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user_missions
DROP TRIGGER IF EXISTS trigger_award_mission_xp ON public.user_missions;
CREATE TRIGGER trigger_award_mission_xp
    AFTER INSERT OR UPDATE ON public.user_missions
    FOR EACH ROW
    EXECUTE FUNCTION public.award_mission_xp();
