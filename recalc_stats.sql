-- Recalculate Profile Stats
-- This script ensures the profile stats match the actual activity in other tables.

UPDATE public.profiles p
SET 
    -- Count messages
    conversations_count = (
        SELECT count(*) 
        FROM public.messages m 
        WHERE m.user_id = p.id AND m.role = 'user'
    ),
    -- Count active days
    days_active = (
        SELECT count(DISTINCT activity_date) 
        FROM public.user_daily_activity da 
        WHERE da.user_id = p.id
    ),
    -- Recalculate Level (Simple formula: Total XP / 1000 + 1)
    level = floor(total_xp / 1000) + 1
WHERE id IN (SELECT id FROM auth.users);

-- Verify the result for the specific user "ayan" if possible
SELECT full_name, age, conversations_count, days_active, level, bond_score 
FROM public.profiles 
WHERE full_name ILIKE '%ayan%';
