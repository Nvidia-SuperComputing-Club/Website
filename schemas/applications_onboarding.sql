-- ============================================================
-- MIGRATION: applications — interactive onboarding fields
-- Run this on an existing database that already has the
-- `applications` table (schemas/applications.sql).
-- Safe to run more than once.
-- ============================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS department TEXT,   -- e.g. "Computer Science & Engineering"
  ADD COLUMN IF NOT EXISTS semester   TEXT,   -- e.g. "5th Semester"
  ADD COLUMN IF NOT EXISTS interests  TEXT[], -- tracks picked during onboarding
  ADD COLUMN IF NOT EXISTS goal       TEXT;   -- what the applicant wants out of the year

-- Applications are usually reviewed department by department.
CREATE INDEX IF NOT EXISTS idx_applications_department ON public.applications (department);
