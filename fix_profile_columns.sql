-- ============================================
-- Fix Missing Profile Columns
-- ============================================

-- The update_user_stats trigger relies on these columns.
-- If they are missing, the trigger will fail, causing message sending to error out.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS conversations_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS days_active INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bond_score FLOAT DEFAULT 0;

-- Also verify user_settings exists just in case
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    safe_mode BOOLEAN DEFAULT TRUE,
    couple_mode BOOLEAN DEFAULT FALSE,
    relationship_type TEXT DEFAULT 'switch',
    selected_personality_id TEXT DEFAULT 'caring-guardian',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for settings if newly created
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can view their own settings'
    ) THEN
        CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can update their own settings'
    ) THEN
        CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can insert their own settings'
    ) THEN
        CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;
