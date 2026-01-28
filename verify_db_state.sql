-- List All Triggers on 'messages' and 'profiles'
SELECT 
    event_object_table as table_name,
    trigger_name,
    action_statement as trigger_action,
    action_timing
FROM information_schema.triggers
WHERE event_object_table IN ('messages', 'profiles');

-- List All Policies on 'profiles' and 'messages'
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'messages');

-- Check column types for profiles to ensure 'age' is int
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
