CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
      id,
      full_name,
      -- role removed as it does not exist in the table
      bond_score,
      level,
      days_active,
      conversations_count,
      age,
      settings,
      created_at,
      updated_at,
      email -- Added email since it exists in the table and isn't being populated
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Explorer'),
    0, -- bond_score
    1, -- level
    1, -- days_active
    0, -- conversations_count
    (NEW.raw_user_meta_data->>'age')::int,
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
    NOW(),
    NEW.email -- Populate email from auth.users
  );

  -- Backward compatibility for user_settings
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
    NULL;
  END;

  RETURN NEW;
END;
$function$;
