-- Reset last_reward_claim for the current user (or all users) to allow re-claiming
-- carefully targeting only if XP suggests they haven't progressed much today, or just force it.

UPDATE profiles
SET last_reward_claim = NULL, streak = 0
WHERE id = auth.uid(); 

-- Note: Since you run this in SQL Editor, auth.uid() might be null. 
-- Better to target by email or just update all for now (assuming dev/test env).
-- Or just:
UPDATE profiles 
SET last_reward_claim = last_reward_claim - INTERVAL '1 day'
WHERE last_reward_claim > NOW() - INTERVAL '1 day';
