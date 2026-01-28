-- CLEANUP DUPLICATE POLICIES
-- We have "Enable ..." and "Users can ..." policies active at the same time.
-- This script removes ALL of them and sets just the standard 3.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Drop the "Active" duplicates found in your list
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 2. Drop the "Enable" variants just to be sure we re-create cleanly
DROP POLICY IF EXISTS "Enable read for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users" ON public.profiles;

-- 3. Re-Create the ONE Standard Set
CREATE POLICY "Enable read for users" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Enable insert for users" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Verify (Should only see 3 rows now)
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
