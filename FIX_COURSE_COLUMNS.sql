-- EMERGENCY FIX
-- Run this to force-add the missing columns
-- ==========================================

-- 1. Reload the Schema Cache (internal Supabase command)
NOTIFY pgrst, 'reload config';

-- 2. Add the columns if they are missing
ALTER TABLE students ADD COLUMN IF NOT EXISTS program_type TEXT DEFAULT 'cohort';
ALTER TABLE students ADD COLUMN IF NOT EXISTS specific_course TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS referred_by TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS selected_slot TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS session_time TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS mode TEXT;

-- 3. Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students';
