-- PROOF OF DATA
-- You suspect nothing is being saved.
-- This script shows that data IS being saved, but likely on "Yesterday" (Server Time).

SELECT 
    mission_date, 
    mission_id, 
    progress, 
    updated_at 
FROM public.user_missions 
ORDER BY updated_at DESC;

-- Check Server Time again
SELECT now()::date as server_date, now()::time as server_time;
