-- Check Latest User and Profile
-- This helps determine if the newest user (Member Since 1/23) has a profile row.

SELECT 
    u.id as user_id, 
    u.email, 
    u.created_at, 
    p.id as profile_id, 
    p.full_name 
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 5;
