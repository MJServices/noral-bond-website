-- Make the Daily Check robust
CREATE OR REPLACE FUNCTION public.check_daily_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run as admin to bypass potential RLS issues
AS $function$
DECLARE
  last_activity timestamptz;
BEGIN
  -- Get the last active date
  SELECT last_active_at INTO last_activity
  FROM public.profiles
  WHERE id = auth.uid();

  -- Logic: If different day, +1. If NULL (first time), +1.
  IF last_activity IS NULL OR date_trunc('day', last_activity) < date_trunc('day', NOW()) THEN
    UPDATE public.profiles
    SET 
        days_active = COALESCE(days_active, 0) + 1,
        last_active_at = NOW()
    WHERE id = auth.uid();
  ELSE
    -- Same day, just update timestamp
    UPDATE public.profiles
    SET last_active_at = NOW()
    WHERE id = auth.uid();
  END IF;
END;
$function$;
