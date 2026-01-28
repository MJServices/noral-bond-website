-- CLEANUP SETTINGS POLICIES
-- Remove duplicates and standardize on one set of rules.

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- 1. Drop EVERYTHING on this table to start clean
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;

DROP POLICY IF EXISTS "Users can read own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;

DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;

DROP POLICY IF EXISTS "Enable read for users" ON public.user_settings;
DROP POLICY IF EXISTS "Enable insert for users" ON public.user_settings;
DROP POLICY IF EXISTS "Enable update for users" ON public.user_settings;

-- 2. Create Standard Policies (Consistent with Profiles)
CREATE POLICY "Enable read for users" 
ON public.user_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users" 
ON public.user_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users" 
ON public.user_settings FOR UPDATE 
USING (auth.uid() = user_id);

-- 3. Verify
SELECT policyname FROM pg_policies WHERE tablename = 'user_settings';
