-- ============================================================
-- MASTER MIGRATION — NVIDIA Supercomputing Club Website
-- Run this file to set up the entire database from scratch.
-- Order matters: shared functions first, then tables.
-- ============================================================

-- ── Shared utility function (required by all tables) ────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── Tables ──────────────────────────────────────────────────
\i events.sql
\i team.sql
\i applications.sql
