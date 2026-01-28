-- Recalculate Stats for CURRENT user
-- Now that the profile row exists, we populate it with actual data from messages/activity.

UPDATE public.profiles p
SET 
    conversations_count = (
        SELECT count(*) 
        FROM public.messages m 
        WHERE m.user_id = p.id AND m.role = 'user'
    ),
    days_active = (
        SELECT count(DISTINCT activity_date) 
        FROM public.user_daily_activity da 
        WHERE da.user_id = p.id
    ),
    -- Bond score logic (simple placeholder: 1 point per 10 messages for now, or just random if not stored)
    bond_score = (
         SELECT floor(count(*) / 10) 
         FROM public.messages m 
         WHERE m.user_id = p.id
    ),
    level = floor(total_xp / 1000) + 1
WHERE id = '1eefb9bf-7b85-475d-a756-d92b886133e5'; -- ayancoder8

-- Show the result
SELECT full_name, conversations_count, days_active, bond_score, level 
FROM public.profiles 
WHERE id = '1eefb9bf-7b85-475d-a756-d92b886133e5';
