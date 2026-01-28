CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
      id,
      full_name,
      email,
      age,
      bond_score,
      level,
      days_active,
      conversations_count,
      settings,
      member_since, -- Replaces 'created_at' which does not exist
      updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Explorer'),
    NEW.email,
    (NEW.raw_user_meta_data->>'age')::int,
    0, -- bond_score default
    1, -- level default
    1, -- days_active (start at 1)
    0, -- conversations_count
    jsonb_build_object(
      'notifications', jsonb_build_object('email', true, 'push', true, 'marketing', false, 'message_preview', true),
      'privacy', jsonb_build_object('profile_visibility', 'private', 'show_activity', true, 'conversation_analysis', true, 'conversation_history', true, 'anonymous_analytics', false, 'location_sharing', false),
      'theme', 'dark',
      'appearance', jsonb_build_object('font_size', 'medium', 'compact_mode', true),
      'audio', jsonb_build_object('sound_effects', true, 'vibration', true),
      'chat', jsonb_build_object('auto_send', true, 'typing_indicator', true),
      'security', jsonb_build_object('biometric', true, 'session_timeout', '30m'),
      'data', jsonb_build_object('auto_delete', false, 'ai_training', false),
      'content', jsonb_build_object('safe_mode', true, 'couples_mode', false)
    ),
    NOW(), -- member_since
    NOW()  -- updated_at
  );

  -- Handle user_settings if needed (Wrapped in block to ignore failure if table missing)
  BEGIN
    INSERT INTO public.user_settings (user_id, selected_personality_id, relationship_type, safe_mode, couple_mode, created_at)
    VALUES (
        NEW.id,
        'caring-guardian',
        COALESCE(NEW.raw_user_meta_data->>'preferred_role', 'switch'),
        TRUE,
        FALSE,
        NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Silently ignore connection errors to user_settings to ensure profile creation succeeds
  END;

  RETURN NEW;
END;
$function$;
