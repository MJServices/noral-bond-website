-- Add JSONB settings column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{
  "notifications": {
    "email": true,
    "push": true,
    "marketing": false
  },
  "privacy": {
    "profile_visibility": "public",
    "show_activity": true
  },
  "theme": "dark"
}'::jsonb;
