-- Check Permissions for 'missions' table
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'missions';

-- Check RLS Policies specifically for missions
SELECT * FROM pg_policies WHERE tablename = 'missions';

-- Check if I can select from it as anonymous (simulating issue) or just count rows
SELECT count(*) FROM public.missions;

-- Check Streak for current user
SELECT current_streak FROM public.profiles WHERE id = '1eefb9bf-7b85-475d-a756-d92b886133e5';
