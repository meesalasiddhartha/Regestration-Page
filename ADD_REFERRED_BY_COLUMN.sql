-- SQL to add the 'referred_by' column to the 'students' table
-- This field is optional (nullable) as not all students will have a referral.

ALTER TABLE students 
ADD COLUMN referred_by TEXT;
