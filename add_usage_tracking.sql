-- Add usage columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS daily_image_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_video_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_usage_reset TIMESTAMPTZ DEFAULT now();

-- Drop existing function if any (for updates)
DROP FUNCTION IF EXISTS public.increment_feature_usage;

-- Create RPC function to safely check and increment usage
CREATE OR REPLACE FUNCTION public.increment_feature_usage(
  p_user_id UUID,
  p_feature_type TEXT, -- 'image' or 'video'
  p_limit INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_count INTEGER;
  v_last_reset TIMESTAMPTZ;
  v_new_count INTEGER;
  v_column_name TEXT;
BEGIN
  -- Determine column based on feature type
  IF p_feature_type = 'image' THEN
    v_column_name := 'daily_image_count';
  ELSIF p_feature_type = 'video' THEN
    v_column_name := 'daily_video_count';
  ELSE
    RETURN jsonb_build_object('allowed', false, 'error', 'Invalid feature type');
  END IF;

  -- Get current state
  SELECT 
    CASE WHEN p_feature_type = 'image' THEN daily_image_count ELSE daily_video_count END,
    last_usage_reset
  INTO v_current_count, v_last_reset
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if we need to reset (if last reset was yesterday or earlier)
  IF v_last_reset < current_date THEN
    v_current_count := 0;
    
    UPDATE public.profiles
    SET 
      daily_image_count = 0,
      daily_video_count = 0,
      last_usage_reset = now()
    WHERE id = p_user_id;
  END IF;

  -- Check limit
  -- If limit is -1, it means unlimited
  IF p_limit != -1 AND v_current_count >= p_limit THEN
    RETURN jsonb_build_object(
      'allowed', false, 
      'current_count', v_current_count, 
      'limit', p_limit,
      'message', 'Daily limit reached'
    );
  END IF;

  -- Increment
  v_new_count := v_current_count + 1;

  IF p_feature_type = 'image' THEN
    UPDATE public.profiles SET daily_image_count = v_new_count WHERE id = p_user_id;
  ELSE
    UPDATE public.profiles SET daily_video_count = v_new_count WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'allowed', true, 
    'current_count', v_new_count,
    'limit', p_limit
  );
END;
$$;
