-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    safe_mode BOOLEAN DEFAULT TRUE,
    couple_mode BOOLEAN DEFAULT FALSE,
    relationship_type TEXT DEFAULT 'switch',
    selected_personality_id TEXT DEFAULT 'caring-guardian',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own settings" 
ON public.user_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
ON public.user_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Trigger to create settings on user signup
-- We can add this to the existing handle_new_user function or make a new one.
-- Let's append to the existing trigger logic by updating the function if possible, 
-- or just rely on the frontend/backend to create it lazily. 
-- For robustness, let's auto-create it.

CREATE OR REPLACE FUNCTION public.handle_new_user_settings() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for settings
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_settings();

-- Backfill for existing users
INSERT INTO public.user_settings (user_id)
SELECT id FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.user_settings WHERE user_id = auth.users.id);
