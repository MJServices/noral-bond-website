-- ============================================
-- FINAL VERIFICATION
-- ============================================

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users LIMIT 1;
    
    IF target_user_id IS NOT NULL THEN
        -- Insert a dummy message
        INSERT INTO public.messages (user_id, content, role)
        VALUES (target_user_id, 'FINAL_VERIFY_TRIGGER', 'user');
    END IF;
END $$;

-- Now show the results explicitly (No "Messages" tab needed)
SELECT 
    user_id,
    activity_date,
    message_count,
    xp_earned
FROM public.user_daily_activity 
WHERE activity_date = CURRENT_DATE;
