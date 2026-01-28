-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Insert missing profile for the specific user (using their ID from the error logs)
INSERT INTO public.profiles (id, email, full_name)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id = '23c8c707-5ee1-4162-89c6-f4045df7c21e'
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure they have default subscription tier
UPDATE public.profiles
SET subscription_tier = 'standard' -- They just paid for standard!
WHERE id = '23c8c707-5ee1-4162-89c6-f4045df7c21e';

-- 3. Verify the row exists
SELECT * FROM public.profiles WHERE id = '23c8c707-5ee1-4162-89c6-f4045df7c21e';
