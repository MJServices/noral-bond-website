-- TRANSACTION START
BEGIN;

-- 1. PROFILES SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove any ghost policies
DROP POLICY IF EXISTS "Enable read for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Re-Add Polices (The "Keys" to the database)
CREATE POLICY "Enable read for users" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Enable insert for users" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users" ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. MESSAGES SECURITY (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for users" ON public.messages;
DROP POLICY IF EXISTS "Enable select for users" ON public.messages;

CREATE POLICY "Enable insert for users" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users" ON public.messages FOR SELECT USING (auth.uid() = user_id);


-- 3. CHAT STATS TRIGGER (The "Automation")
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

COMMIT;
-- TRANSACTION END

-- 4. VERIFICATION (Check if it worked)
SELECT 'Policies Count' as check_type, count(*) as count FROM pg_policies WHERE tablename IN ('profiles', 'messages')
UNION ALL
SELECT 'Triggers Count', count(*) FROM information_schema.triggers WHERE event_object_table IN ('messages', 'profiles');
