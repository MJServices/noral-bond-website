-- ============================================
-- Fix Bond Score & Progress Tracking
-- ============================================

-- 1. Add bond_score to profiles if missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bond_score FLOAT DEFAULT 0;

-- 2. Update the stats trigger to use user_settings for personality/bonding multiplier
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_last_message_time TIMESTAMP WITH TIME ZONE;
    v_last_active_date DATE;
    v_today DATE;
    v_bond_increment FLOAT;
    v_bonding_multiplier FLOAT := 1.0;
    v_personality_id TEXT;
    v_current_streak INT;
BEGIN
    -- Only process user messages (not assistant)
    IF NEW.role != 'user' THEN
        RETURN NEW;
    END IF;

    v_user_id := NEW.user_id;
    v_today := CURRENT_DATE;

    -- Fetch User Settings/Profile Data
    SELECT 
        COALESCE(us.selected_personality_id, 'caring-guardian'),
        DATE(p.last_active_at),
        COALESCE(p.current_streak, 0)
    INTO v_personality_id, v_last_active_date, v_current_streak
    FROM public.profiles p
    LEFT JOIN public.user_settings us ON p.id = us.user_id
    WHERE p.id = v_user_id;

    -- Determine Bonding Multiplier based on Personality
    -- 'caring-guardian', 'gentle-soul' -> 1.5x (Faster emotional connection)
    -- 'playful-explorer', 'mysterious-enigma' -> 1.2x (Engaging)
    -- 'wise-mentor', 'confident-leader' -> 1.0x (Standard)
    v_bonding_multiplier := CASE 
        WHEN v_personality_id IN ('caring-guardian', 'gentle-soul') THEN 1.5
        WHEN v_personality_id IN ('playful-explorer', 'mysterious-enigma') THEN 1.2
        ELSE 1.0
    END;

    -- ---------------------------------------------------
    -- 1. Common Stats (Conversations, Last Active)
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

    -- ---------------------------------------------------
    -- 2. Streak Logic
    -- ---------------------------------------------------
    IF v_last_active_date IS NULL OR v_last_active_date < v_today THEN
        IF v_last_active_date = (v_today - INTERVAL '1 day')::DATE THEN
            v_current_streak := v_current_streak + 1;
        ELSIF v_last_active_date < (v_today - INTERVAL '1 day')::DATE OR v_last_active_date IS NULL THEN
            v_current_streak := 1;
        END IF;
        
        UPDATE public.profiles
        SET current_streak = v_current_streak,
            days_active = COALESCE(days_active, 0) + 1
        WHERE id = v_user_id;
    END IF;

    -- ---------------------------------------------------
    -- 3. Bond Score & Leveling
    -- ---------------------------------------------------
    v_bond_increment := 0.5 * v_bonding_multiplier;
    
    -- Increment Bond Score (Max 100)
    -- Level = (Bond Score / 10) + 1 (Max 10)
    UPDATE public.profiles
    SET bond_score = LEAST(100, COALESCE(bond_score, 0) + v_bond_increment),
        level = LEAST(10, GREATEST(1, FLOOR((COALESCE(bond_score, 0) + v_bond_increment) / 10) + 1))
    WHERE id = v_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure Trigger Exists
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.messages;
CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_stats();
