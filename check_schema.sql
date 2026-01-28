-- Check profiles table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles';

-- Check user_settings table existence
SELECT to_regclass('public.user_settings');
