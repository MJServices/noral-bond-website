CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
      id,
      full_name,
      role,
      bond_score,
      level,
      days_active,
      conversations_count,
      age, -- Added age
      settings, -- Added settings JSONB
      created_at,
      updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Explorer'),
    'user',
    0,
    1,
    1,
    0,
    (NEW.raw_user_meta_data->>'age')::int, -- Extract age from metadata
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
    NOW(),
    NOW()
  );

  -- Backward compatibility: Keep populating user_settings if the table still exists and is used
  -- We wrap it in a BEGIN/EXCEPTION block to ignore errors if the table is gone or constraint fails
  BEGIN
    INSERT INTO public.user_settings (user_id, selected_personality_id, relationship_type, safe_mode, couple_mode, created_at)
    VALUES (
        NEW.id,
        'caring-guardian',
        COALESCE(NEW.raw_user_meta_data->>'preferred_role', 'switch'), -- Use preferred_role from metadata
        TRUE,
        FALSE,
        NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors for the deprecated table
    NULL;
  END;

  RETURN NEW;
END;
$function$;
