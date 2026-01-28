-- Check Database Time
SELECT 
    now() as db_timestamp_tz, 
    CURRENT_DATE as db_date, 
    timezone('utc', now()) as db_utc_time;
