-- Migration 002: Add phone number to profiles
-- Run this in Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Phone is visible only to admins via service_role; regular users can update their own
-- (already covered by the existing UPDATE policy on profiles for own rows)
