-- ============================================
-- Dynamic User Stats Tracking System
-- ============================================

-- Function to update user stats when a message is sent
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_last_message_time TIMESTAMP WITH TIME ZONE;
    v_today DATE;
    v_days_active INT;
    v_bond_increment FLOAT;
    v_bonding_multiplier FLOAT := 1.0;
BEGIN
    -- Only process user messages (not assistant)
    IF NEW.role != 'user' THEN
        RETURN NEW;
    END IF;

    v_user_id := NEW.user_id;
    v_today := CURRENT_DATE;

    -- Get bonding multiplier from user's selected AI model
    SELECT COALESCE(am.bonding_multiplier, 1.0) INTO v_bonding_multiplier
    FROM public.profiles p
    LEFT JOIN public.ai_models am ON p.selected_model_id = am.id
    WHERE p.id = v_user_id;

    -- Get the last message time for this user (before this one)
    SELECT MAX(created_at) INTO v_last_message_time
    FROM public.messages
    WHERE user_id = v_user_id AND id != NEW.id;

    -- Update last_active_at
    UPDATE public.profiles
    SET last_active_at = NEW.created_at
    WHERE id = v_user_id;

    -- Increment conversations_count if:
    -- 1. This is the first message ever, OR
    -- 2. Last message was more than 1 hour ago (new conversation session)
    IF v_last_message_time IS NULL OR 
       (NEW.created_at - v_last_message_time) > INTERVAL '1 hour' THEN
        UPDATE public.profiles
        SET conversations_count = COALESCE(conversations_count, 0) + 1
        WHERE id = v_user_id;
    END IF;

    -- Calculate days_active: count distinct dates with messages
    SELECT COUNT(DISTINCT DATE(created_at)) INTO v_days_active
    FROM public.messages
    WHERE user_id = v_user_id;

    -- Update days_active
    UPDATE public.profiles
    SET days_active = v_days_active
    WHERE id = v_user_id;

    -- Increment bond_score by 0.5% per message, apply multiplier, cap at 100
    v_bond_increment := 0.5 * v_bonding_multiplier;
    
    UPDATE public.profiles
    SET bond_score = LEAST(100, COALESCE(bond_score, 0) + v_bond_increment)
    WHERE id = v_user_id;

    -- Level up system: Level = (bond_score / 10) + 1, capped at 10
    UPDATE public.profiles
    SET level = LEAST(10, GREATEST(1, FLOOR(COALESCE(bond_score, 0) / 10) + 1))
    WHERE id = v_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on messages table
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.messages;
CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_stats();

-- Note: this trigger will fire on every message insert
-- For better performance on high-traffic systems, consider using a background job
