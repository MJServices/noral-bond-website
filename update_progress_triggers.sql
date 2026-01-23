-- ============================================
-- Dynamic Progress Tracking System (Updated)
-- ============================================

CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_last_message_time TIMESTAMP WITH TIME ZONE;
    v_last_active_date DATE;
    v_today DATE;
    v_days_active INT;
    v_bond_increment FLOAT;
    v_bonding_multiplier FLOAT := 1.0;
    v_xp_gain INT := 10; -- Base XP per message
    v_current_streak INT;
BEGIN
    -- Only process user messages (not assistant)
    IF NEW.role != 'user' THEN
        RETURN NEW;
    END IF;

    v_user_id := NEW.user_id;
    v_today := CURRENT_DATE;

    -- Get user profile data (bonding multiplier, last active, streak)
    SELECT 
        COALESCE(am.bonding_multiplier, 1.0),
        DATE(p.last_active_at),
        COALESCE(p.current_streak, 0)
    INTO v_bonding_multiplier, v_last_active_date, v_current_streak
    FROM public.profiles p
    LEFT JOIN public.ai_models am ON p.selected_model_id = am.id
    WHERE p.id = v_user_id;

    -- 1. Updates common stats (Conversations, Days Active)
    -- ---------------------------------------------------
    
    -- Get time of previous message
    SELECT MAX(created_at) INTO v_last_message_time
    FROM public.messages
    WHERE user_id = v_user_id AND id != NEW.id;

    -- Update last_active_at
    UPDATE public.profiles
    SET last_active_at = NEW.created_at
    WHERE id = v_user_id;

    -- Increment conversations_count (New session > 1 hour)
    IF v_last_message_time IS NULL OR 
       (NEW.created_at - v_last_message_time) > INTERVAL '1 hour' THEN
        UPDATE public.profiles
        SET conversations_count = COALESCE(conversations_count, 0) + 1
        WHERE id = v_user_id;
    END IF;

    -- 2. Streak Logic
    -- ---------------
    -- If first activity today
    IF v_last_active_date IS NULL OR v_last_active_date < v_today THEN
        -- If active yesterday, increment streak
        IF v_last_active_date = (v_today - INTERVAL '1 day')::DATE THEN
            v_current_streak := v_current_streak + 1;
        -- If missed a day (or new user), reset to 1
        ELSIF v_last_active_date < (v_today - INTERVAL '1 day')::DATE OR v_last_active_date IS NULL THEN
            v_current_streak := 1;
        END IF;
        -- If already active today, streak doesn't change
        
        UPDATE public.profiles
        SET current_streak = v_current_streak,
            days_active = COALESCE(days_active, 0) + 1 -- Increment unique days active count
        WHERE id = v_user_id;
    END IF;

    -- 3. XP & Daily Activity Logging
    -- ------------------------------
    -- Apply bonding impact to XP? keeping it simple for now, static XP gain
    v_xp_gain := 10;
    
    -- Update Total XP and Level
    UPDATE public.profiles
    SET total_xp = COALESCE(total_xp, 0) + v_xp_gain
    WHERE id = v_user_id;

    -- Upsert Daily Activity Log
    INSERT INTO public.user_daily_activity (user_id, activity_date, xp_earned, message_count)
    VALUES (v_user_id, v_today, v_xp_gain, 1)
    ON CONFLICT (user_id, activity_date) 
    DO UPDATE SET 
        xp_earned = user_daily_activity.xp_earned + EXCLUDED.xp_earned,
        message_count = user_daily_activity.message_count + 1;

    -- 4. Bond Score (Original Logic)
    -- ------------------------------
    v_bond_increment := 0.5 * v_bonding_multiplier;
    
    UPDATE public.profiles
    SET bond_score = LEAST(100, COALESCE(bond_score, 0) + v_bond_increment),
        -- Recalculate level based on XP? Or keep Bond Score level? 
        -- Let's stick to Bond Score driving "Level" for now as per original design, 
        -- or switch to XP based level? 
        -- Original design used Level = (bond / 10) + 1. 
        -- Let's keep that consistent with "Bond Level". 
        -- But "XP Level" is usually grander. 
        -- Let's keep the original "Level" formula for now to avoid breaking UI expectations.
        level = LEAST(10, GREATEST(1, FLOOR((COALESCE(bond_score, 0) + v_bond_increment) / 10) + 1))
    WHERE id = v_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
