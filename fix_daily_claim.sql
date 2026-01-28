-- Add columns if not exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'streak') THEN
        ALTER TABLE profiles ADD COLUMN streak INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_reward_claim') THEN
        ALTER TABLE profiles ADD COLUMN last_reward_claim TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

CREATE OR REPLACE FUNCTION claim_daily_login(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_streak INTEGER;
    v_last_claim TIMESTAMP WITH TIME ZONE;
    v_now TIMESTAMP WITH TIME ZONE := now();
    v_xp_amount INTEGER;
    v_days_diff INTEGER;
    v_result JSONB;
BEGIN
    -- Get current state
    SELECT streak, last_reward_claim INTO v_streak, v_last_claim
    FROM profiles
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Calculate days based on calendar dates, not 24h intervals
    -- This handles the case where user claims at 11pm and then 1am (should be allowed next day)
    IF v_last_claim IS NULL THEN
        -- First claim ever
        v_streak := 1;
    ELSE
        -- Check if already claimed today (UTC)
        IF DATE(v_now AT TIME ZONE 'UTC') <= DATE(v_last_claim AT TIME ZONE 'UTC') THEN
             RETURN jsonb_build_object('success', false, 'message', 'Already claimed for today');
        END IF;

        -- Check if streak continues (claimed yesterday)
        IF DATE(v_now AT TIME ZONE 'UTC') = DATE(v_last_claim AT TIME ZONE 'UTC') + INTERVAL '1 day' THEN
            v_streak := COALESCE(v_streak, 0) + 1;
        ELSE
            -- Missed a day or more
            v_streak := 1;
        END IF;
    END IF;
    
    -- v_streak is now set, proceed to reward
    -- (Previous logic for v_days_diff is removed/replaced by above)

    -- Calculate XP Reward
    IF v_streak <= 2 THEN
        v_xp_amount := 50;
    ELSIF v_streak <= 6 THEN
        v_xp_amount := 100;
    ELSE
        v_xp_amount := 200;
    END IF;

    -- Add XP (this returns JSON result from add_xp)
    SELECT add_xp(p_user_id, v_xp_amount, 'daily_login', jsonb_build_object('streak', v_streak)) INTO v_result;

    -- Update Update Profile Streak Metadata
    UPDATE profiles
    SET 
        streak = v_streak,
        last_reward_claim = v_now
    WHERE id = p_user_id;

    RETURN v_result || jsonb_build_object('new_streak', v_streak);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION claim_daily_login TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION calculate_level TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION add_xp TO authenticated, service_role;
GRANT SELECT ON xp_logs TO authenticated, service_role;
