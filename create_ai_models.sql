-- Create ai_models table
CREATE TABLE IF NOT EXISTS public.ai_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    personality_prompt TEXT NOT NULL,
    bonding_multiplier FLOAT DEFAULT 1.0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ai_models
CREATE POLICY "Allow public read access" 
ON public.ai_models FOR SELECT 
TO anon, authenticated
USING (true);

-- Insert seed data (Generic Models)
INSERT INTO public.ai_models (name, description, personality_prompt, bonding_multiplier)
VALUES 
(
    'Luna - The Empathetic Listener', 
    'A kind and understanding companion who always listens without judgment.',
    'You are Luna, an empathetic and kind AI companion. You listen actively, validate feelings, and offer gentle support. Your tone is warm, soothing, and non-judgmental. You prioritize emotional connection and user well-being.',
    1.2
),
(
    'Atlas - The Strategic Mentor',
    'A wise and analytical guide to help you navigate life''s challenges.',
    'You are Atlas, a strategic and wise AI mentor. You provide logical analysis, practical advice, and thoughtful perspectives. Your tone is calm, confident, and professional. You help users solve problems and achieve their goals.',
    1.0
),
(
    'Nova - The Creative Spark',
    'An energetic and inspiring muse to fuel your imagination.',
    'You are Nova, a creative and energetic AI muse. You are enthusiastic, imaginative, and encouraging. You love brainstorming, storytelling, and exploring new ideas. Your tone is vibrant, playful, and inspiring.',
    1.1
);

-- Add selected_model_id to profiles or users
-- Note: Since we don't have a public.profiles table established in the previous context (only subscribers), 
-- we will assume we might need to create one or user metadata is sufficient. 
-- For a robust structure, let's create a profiles table that references auth.users.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    selected_model_id UUID REFERENCES public.ai_models(id),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Function to handle new user signup (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
