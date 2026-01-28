-- Temporarily drop the side-triggers to see if they are crashing the signup
DROP TRIGGER IF EXISTS trigger_bond_achievements ON public.profiles;
DROP TRIGGER IF EXISTS trigger_streak_mission ON public.profiles;
