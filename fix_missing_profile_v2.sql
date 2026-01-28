-- Fix Missing Profile (Corrected Column Names)
-- Manually create the profile row for the user that is missing it.

INSERT INTO public.profiles (id, email, full_name, age, member_since, updated_at)
VALUES (
    '1eefb9bf-7b85-475d-a756-d92b886133e5', -- User ID for ayancoder8@gmail.com
    'ayancoder8@gmail.com',                 -- Email
    'Explorer',                             -- Default Name
    0,                                      -- Default Age
    NOW(),                                  -- member_since (instead of created_at)
    NOW()                                   -- updated_at
)
ON CONFLICT (id) DO NOTHING;

-- Verify creation
SELECT * FROM public.profiles WHERE id = '1eefb9bf-7b85-475d-a756-d92b886133e5';
    