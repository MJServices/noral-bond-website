-- FORCE FIX PERMISSIONS (Nuclear Option)

-- 1. Reset Profiles Table Permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop EVERYTHING to be safe
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;

-- Create SIMPLE, CLEAR policies
CREATE POLICY "Enable read for users" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Enable insert for users" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users" ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Reset Messages Table Permissions (For Chat)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;

CREATE POLICY "Enable insert for users" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users" ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users" ON public.messages FOR DELETE USING (auth.uid() = user_id);


-- 3. Verify Triggers are present
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.profiles
  SET 
    conversations_count = COALESCE(conversations_count, 0) + 1,
    bond_score = LEAST(COALESCE(bond_score, 0) + 1, 100),
    last_active_at = NOW(),
    updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_message_sent ON public.messages;
CREATE TRIGGER on_message_sent
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_message();
