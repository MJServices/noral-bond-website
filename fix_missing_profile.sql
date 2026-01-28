-- Fix Missing Profile
-- Manually create the profile row for the user that is missing it.

INSERT INTO public.profiles (id, email, full_name, age, created_at, updated_at)
VALUES (
    '1eefb9bf-7b85-475d-a756-d92b886133e5', -- User ID from previous step
    'ayancoder8@gmail.com',                 -- Email
    'Explorer',                             -- Default Name
    0,                                      -- Default Age
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Also verify it worked
SELECT * FROM public.profiles WHERE id = '1eefb9bf-7b85-475d-a756-d92b886133e5';
