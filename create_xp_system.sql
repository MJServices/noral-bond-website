-- 1. Add XP and Level columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'xp') THEN
        ALTER TABLE profiles ADD COLUMN xp INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'level') THEN
        ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 1;
    END IF;
END $$;

-- 2. Create XP Logs table
CREATE TABLE IF NOT EXISTS xp_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    source TEXT NOT NULL, -- 'daily_login', 'course_completion', etc.
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on xp_logs
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own logs
DROP POLICY IF EXISTS "Users can view own xp logs" ON xp_logs;
CREATE POLICY "Users can view own xp logs" ON xp_logs
    FOR SELECT USING (auth.uid() = user_id);

-- 3. Function to Calculate Level
CREATE OR REPLACE FUNCTION calculate_level(total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
    new_level INTEGER;
BEGIN
    IF total_xp < 100 THEN new_level := 1;
    ELSIF total_xp < 300 THEN new_level := 2;
    ELSIF total_xp < 600 THEN new_level := 3;
    ELSIF total_xp < 1000 THEN new_level := 4;
    ELSIF total_xp < 1500 THEN new_level := 5;
    ELSIF total_xp < 2100 THEN new_level := 6;
    ELSE
        -- Level 7+ logic: Base XP for Lvl 6 (2100? No, wait)
        -- Logic: Level 1-6 Fixed.
        -- 0-99 (1), 100-299 (2), 300-599 (3), 600-999 (4), 1000-1499 (5), 1500-2099 (6).
        -- So at 2100, you hit Level 7? Or does 2100 start the "next" phase?
        -- User said: "Level 7+ -> previous + 300 XP".
        -- Let's interpret "previous" as the cap of the previous level.
        -- Cap of Lvl 6 is 2099. So 2100 starts Lvl 7.
        -- Lvl 7 = 2100 to 2399 (2100 + 300)
        -- Lvl 8 = 2400 to 2699
        -- Formula: Floor((TotalXP - 2100) / 300) + 7
        new_level := FLOOR((total_xp - 2100) / 300) + 7;
    END IF;
    
    RETURN new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Transactional RPC to Add XP
CREATE OR REPLACE FUNCTION add_xp(
    p_user_id UUID,
    p_amount INTEGER,
    p_source TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    current_xp INTEGER;
    current_level INTEGER;
    new_xp INTEGER;
    new_level INTEGER;
    leveled_up BOOLEAN;
BEGIN
    -- 1. Get current stats
    SELECT xp, level INTO current_xp, current_level
    FROM profiles
    WHERE id = p_user_id;

    -- Handle missing profile gracefully (create or error? Error is safer for now)
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found for user %', p_user_id;
    END IF;

    -- 2. Calculate values
    new_xp := COALESCE(current_xp, 0) + p_amount;
    new_level := calculate_level(new_xp);
    leveled_up := (new_level > COALESCE(current_level, 1));

    -- 3. Log it
    INSERT INTO xp_logs (user_id, amount, source, metadata)
    VALUES (p_user_id, p_amount, p_source, p_metadata);

    -- 4. Update Profile
    UPDATE profiles
    SET 
        xp = new_xp,
        level = new_level
    WHERE id = p_user_id;

    -- 5. Return result
    RETURN jsonb_build_object(
        'new_xp', new_xp,
        'new_level', new_level,
        'leveled_up', leveled_up,
        'xp_gained', p_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Daily Login Logic
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

    -- Calculate days difference (careful with timezones, using simple day truncation for now)
    -- If null, treat as first time
    IF v_last_claim IS NULL THEN
        v_days_diff := 1; -- First time is valid
    ELSE
        -- Extract diff in days between dates
        v_days_diff := DATE_PART('day', v_now - v_last_claim)::INTEGER;
        
        -- If same day, return already claimed
        IF DATE(v_now) = DATE(v_last_claim) THEN
             RETURN jsonb_build_object('success', false, 'message', 'Already claimed for today');
        END IF;
    END IF;

    -- Update Streak
    IF v_days_diff = 1 OR v_last_claim IS NULL THEN
        -- Consecutive day or first time
        v_streak := COALESCE(v_streak, 0) + 1;
    ELSE
        -- Missed a day (reset)
        v_streak := 1;
    END IF;

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
