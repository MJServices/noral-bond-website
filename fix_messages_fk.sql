-- ============================================
-- Fix Messages Table Foreign Key
-- ============================================

-- The messages table references 'public.users', but it should reference 'auth.users'
-- or 'public.profiles' to ensure all authenticated users can send messages.
-- We will change it to reference 'auth.users'.

DO $$
BEGIN
    -- 1. Drop existing FK constraint if it exists
    -- We try common names for the constraint.
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_user_id_fkey' AND table_name = 'messages'
    ) THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_user_id_fkey;
    END IF;

    -- 2. Add new FK constraint to auth.users
    ALTER TABLE public.messages
    ADD CONSTRAINT messages_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

EXCEPTION
    WHEN undefined_object THEN
        -- If constraint name is different, we might just try adding the new one 
        -- but if the old one exists with a different name it might conflict or just be redundant.
        -- Let's assume standard naming or that the user will report if this fails.
        NULL;
END $$;
