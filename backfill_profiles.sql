-- Backfill profiles for existing users
-- This script inserts a row into public.profiles for any user in auth.users that doesn't already have one.

INSERT INTO public.profiles (id, email, full_name, age, member_since)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Explorer'),
    COALESCE((au.raw_user_meta_data->>'age')::int, 0),
    au.created_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- Output result
SELECT count(*) as "Profiles Created" FROM public.profiles;
