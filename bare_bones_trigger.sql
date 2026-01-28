-- "Bare Bones" Trigger
-- This removes ALL logic except creating the profile row with the ID.
-- If this works, we know the issue was with one of the data fields (JSONB, Age, etc).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Minimal Insert
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;
