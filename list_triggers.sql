-- List triggers on auth.users
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    action_timing,
    action_orientation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

-- List triggers on public.profiles
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    action_timing,
    action_orientation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles' 
  AND event_object_schema = 'public';
