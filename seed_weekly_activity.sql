-- ============================================
-- Seed 7 Days of Activity for Testing
-- ============================================

-- Insert fake activity for the last 7 days for the current user
-- NOTE: Replace 'YOUR_USER_ID_HERE' with your actual User ID from the 'users' table
-- OR simply run this in the SQL Editor where auth.uid() might not work in all contexts, 
-- causing us to rely on the user manually providing ID or just inserting for ALL test users if safe.
-- Usage: Run this, then refresh the Progress Page.

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM auth.users LOOP
        -- Insert activity for last 7 days for EACH user
        INSERT INTO public.user_daily_activity (user_id, activity_date, xp_earned, message_count)
        VALUES 
            (r.id, CURRENT_DATE - INTERVAL '1 day', 100, 5),
            (r.id, CURRENT_DATE - INTERVAL '2 days', 150, 8),
            (r.id, CURRENT_DATE - INTERVAL '3 days', 50, 2),
            (r.id, CURRENT_DATE - INTERVAL '4 days', 200, 10),
            (r.id, CURRENT_DATE - INTERVAL '5 days', 120, 6),
            (r.id, CURRENT_DATE - INTERVAL '6 days', 300, 15),
            (r.id, CURRENT_DATE - INTERVAL '7 days', 80, 4)
        ON CONFLICT (user_id, activity_date) 
        DO UPDATE SET 
            xp_earned = EXCLUDED.xp_earned,
            message_count = EXCLUDED.message_count;
            
        RAISE NOTICE 'Seeded 7 days of activity for user %', r.id;
    END LOOP;
END $$;
