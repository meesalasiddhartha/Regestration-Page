-- ==========================================================
-- FIX DB SCHEMA (Add all potentially missing columns)
-- Run this in Supabase SQL Editor.
-- ==========================================================

-- 1. FIX STUDENTS TABLE
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS program_type TEXT DEFAULT 'cohort',
ADD COLUMN IF NOT EXISTS specific_course TEXT,
ADD COLUMN IF NOT EXISTS referred_by TEXT,
ADD COLUMN IF NOT EXISTS selected_slot TEXT,
ADD COLUMN IF NOT EXISTS session_time TEXT,
ADD COLUMN IF NOT EXISTS mode TEXT;

-- 2. FIX QUESTIONS TABLE (Just in case)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS program_type TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS specific_course_context TEXT;

-- 3. VERIFY
-- This is just to confirm columns are added. No specific output needed.
