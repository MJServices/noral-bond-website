-- Check if public.users exists and what columns it has
SELECT to_json(c)
FROM information_schema.columns c
WHERE table_schema = 'public' AND table_name = 'users';

-- Check profiles table to compare
SELECT to_json(c)
FROM information_schema.columns c
WHERE table_schema = 'public' AND table_name = 'profiles';
