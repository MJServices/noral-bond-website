-- 1. Fix Profile Saving (RLS)
-- Enable RLS on profiles if not already
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile (coverage for signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create policy to allow users to view own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);


-- 2. Fix Chat Stats & Bond Score (Trigger on Messages)
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Update the user's profile stats
  UPDATE public.profiles
  SET 
    conversations_count = COALESCE(conversations_count, 0) + 1,
    bond_score = LEAST(COALESCE(bond_score, 0) + 1, 100), -- Cap at 100%, +1 per message
    last_active_at = NOW(),
    updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$function$;

-- Attach trigger to messages table
DROP TRIGGER IF EXISTS on_message_sent ON public.messages;
CREATE TRIGGER on_message_sent
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_message();


-- 3. Restore "Side Triggers" (Achievements & Missions)
-- We re-create them safely.

-- Re-attach Bond Achievement Trigger
DROP TRIGGER IF EXISTS trigger_bond_achievements ON public.profiles;
CREATE TRIGGER trigger_bond_achievements
AFTER UPDATE OF bond_score, level ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION check_bond_achievements();

-- Re-attach Streak Mission Trigger
DROP TRIGGER IF EXISTS trigger_streak_mission ON public.profiles;
CREATE TRIGGER trigger_streak_mission
AFTER UPDATE OF current_streak, days_active ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_streak_mission();


-- 4. Ensure Dependencies Exist (Safe Table Creation)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id text NOT NULL,
    unlocked_at timestamptz DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.user_missions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id text NOT NULL,
    progress int DEFAULT 0,
    completed boolean DEFAULT false,
    mission_date date DEFAULT CURRENT_DATE,
    updated_at timestamptz DEFAULT NOW(),
    UNIQUE(user_id, mission_id, mission_date)
);

-- Enable RLS for these tables too
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own missions" ON public.user_missions;
CREATE POLICY "Users can view own missions" ON public.user_missions FOR SELECT USING (auth.uid() = user_id);
