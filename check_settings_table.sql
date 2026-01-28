-- Check if 'user_settings' table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'user_settings';

-- Check user_settings columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_settings';

-- Check RLS on user_settings
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'user_settings';
