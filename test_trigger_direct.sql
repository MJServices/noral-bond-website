-- Test Trigger Logic Directly
-- This script inserts a dummy message for the FIRST user found in the database.
-- It then checks if user_daily_activity was updated.

DO $$
DECLARE
    target_user_id UUID;
    initial_xp INTEGER;
    final_xp INTEGER;
BEGIN
    -- 1. Get a user
    SELECT id INTO target_user_id FROM auth.users LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'No user found to test with.';
    END IF;

    -- 2. Check current daily XP
    SELECT COALESCE(xp_earned, 0) INTO initial_xp 
    FROM public.user_daily_activity 
    WHERE user_id = target_user_id AND activity_date = CURRENT_DATE;

    RAISE NOTICE 'Initial XP for user %: %', target_user_id, COALESCE(initial_xp, 0);

    -- 3. Insert a dummy message (Simulate "sending" a message)
    INSERT INTO public.messages (user_id, content, role)
    VALUES (target_user_id, 'DEBUG_MESSAGE_TRIGGER_TEST', 'user');

    -- 4. Check new daily XP
    SELECT xp_earned INTO final_xp 
    FROM public.user_daily_activity 
    WHERE user_id = target_user_id AND activity_date = CURRENT_DATE;

    RAISE NOTICE 'Final XP for user %: %', target_user_id, final_xp;

    -- 5. Validate
    IF final_xp > COALESCE(initial_xp, 0) THEN
        RAISE NOTICE 'SUCCESS: Trigger verified! XP increased from % to %', COALESCE(initial_xp, 0), final_xp;
    ELSE
        RAISE EXCEPTION 'FAILURE: XP did not increase. Trigger failed.';
    END IF;
END $$;
