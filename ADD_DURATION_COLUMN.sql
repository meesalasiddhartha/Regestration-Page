-- ============================================
-- ADD DURATION TO SUBMISSIONS
-- Run this in Supabase SQL Editor
-- ============================================

ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'submissions' 
AND column_name = 'duration_seconds';
