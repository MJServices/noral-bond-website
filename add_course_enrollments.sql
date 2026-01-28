-- Create table to track user course enrollments
CREATE TABLE IF NOT EXISTS public.user_course_enrollments (
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.user_course_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own enrollments" 
ON public.user_course_enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" 
ON public.user_course_enrollments FOR INSERT 
WITH CHECK (auth.uid() = user_id);
