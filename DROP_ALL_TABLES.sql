-- ==========================================================
-- DROP ALL TABLES & VIEWS (CLEAN RESET)
-- Run this to wipe the database clean before running FINAL_DB_SCHEMA_V2.sql
-- ==========================================================

-- 1. Drop Views
DROP VIEW IF EXISTS view_cohort_responses;
DROP VIEW IF EXISTS view_ondemand_responses;

-- 2. Drop Tables (Order matters due to foreign keys)
-- 'CASCADE' ensures dependent objects are also removed
DROP TABLE IF EXISTS student_answers CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS alloted_timeslotes CASCADE;

-- 3. Confirmation
-- (No output means success)
