-- Check constraints for profiles
SELECT con.conname, con.contype, pg_get_constraintdef(con.oid)
FROM pg_catalog.pg_constraint con
JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
WHERE nsp.nspname = 'public' AND rel.relname = 'profiles';

-- Check not null columns for profiles again
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Check user_settings table definition if it exists
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_settings' AND table_schema = 'public';
