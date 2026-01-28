-- 1. Restore the Full Trigger (Improved from fix_trigger_v2)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
      id,
      full_name,
      bond_score,
      level,
      days_active, -- Initialize to 1
      conversations_count,
      age,
      settings,
      created_at,
      updated_at,
      email,
      last_active_at -- Track last active time
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Explorer'),
    0, 
    1, 
    1, -- Start with 1 day active
    0, 
    (NEW.raw_user_meta_data->>'age')::int,
    jsonb_build_object(
      'notifications', jsonb_build_object('email', true, 'push', true),
      'privacy', jsonb_build_object('profile_visibility', 'private'),
      'theme', 'dark',
      'security', jsonb_build_object('biometric', true, 'session_timeout', '30m'),
      'data', jsonb_build_object('auto_delete', false)
    ),
    NOW(),
    NOW(),
    NEW.email,
    NOW() -- Set last active to now
  );

  -- Attempt backward compatibility for user_settings if table exists
  BEGIN
    INSERT INTO public.user_settings (user_id, selected_personality_id, relationship_type, safe_mode, couple_mode, created_at)
    VALUES (NEW.id, 'caring-guardian', 'switch', TRUE, FALSE, NOW());
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN NEW;
END;
$function$;

-- 2. Create function to increment days_active
CREATE OR REPLACE FUNCTION public.check_daily_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  last_activity timestamptz;
BEGIN
  -- Get the last active date for the current user
  SELECT last_active_at INTO last_activity
  FROM public.profiles
  WHERE id = auth.uid();

  -- If last_active_at is NULL or it's a different day from NOW()...
  IF last_activity IS NULL OR date_trunc('day', last_activity) < date_trunc('day', NOW()) THEN
    -- Increment days_active and update last_active_at
    UPDATE public.profiles
    SET days_active = COALESCE(days_active, 0) + 1,
        last_active_at = NOW()
    WHERE id = auth.uid();
  ELSE
    -- Just update the timestamp (still same day)
    UPDATE public.profiles
    SET last_active_at = NOW()
    WHERE id = auth.uid();
  END IF;
END;
$function$;
