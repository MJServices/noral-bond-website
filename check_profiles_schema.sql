-- Check Profiles Schema for Settings Columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
