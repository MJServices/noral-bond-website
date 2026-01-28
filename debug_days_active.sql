-- 1. Check current value for the user
SELECT id, full_name, days_active, last_active_at 
FROM public.profiles;

-- 2. Manually run the trigger logic (simulate RPC)
UPDATE public.profiles
SET days_active = COALESCE(days_active, 0) + 1,
    last_active_at = NOW()
WHERE id IN (SELECT id FROM public.profiles LIMIT 1) -- safer for debug
RETURNING days_active, last_active_at;
