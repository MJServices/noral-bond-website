-- EMERGENCY POLICY RESTORE
-- Run this to fix "Permission Denied" or "0 Rows Updated"

-- 1. Ensure RLS is ON
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop potential conflicts (just in case)
DROP POLICY IF EXISTS "Enable read for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users" ON public.profiles;

-- 3. Create the Critical Policies
-- Allow user to SEE their own profile
CREATE POLICY "Enable read for users" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow user to UPDATE their own profile
CREATE POLICY "Enable update for users" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow user to INSERT their own profile (for signup)
CREATE POLICY "Enable insert for users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 4. Verify Immediate Result
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'profiles';
