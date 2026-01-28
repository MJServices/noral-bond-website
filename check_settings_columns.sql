-- Check columns in user_settings table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_settings';
