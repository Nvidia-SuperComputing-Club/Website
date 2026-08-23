-- ============================================================
-- TABLE: team
-- Description: Club team members / leadership directory
-- ============================================================

CREATE TABLE IF NOT EXISTS public.team (
  id            UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT                     NOT NULL,
  role          TEXT                     NOT NULL,           -- e.g. "President", "ML Lead"
  department    TEXT,                                        -- e.g. "CSE", "AI & DS"
  year          TEXT,                                        -- e.g. "3rd Year"
  bio           TEXT,
  avatar_url    TEXT,
  linkedin_url  TEXT,
  github_url    TEXT,
  email         TEXT,
  "order"       INTEGER                  NOT NULL DEFAULT 0, -- display sort order
  is_active     BOOLEAN                  NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ              NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ              NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
DROP TRIGGER IF EXISTS team_set_updated_at ON public.team;
CREATE TRIGGER team_set_updated_at
  BEFORE UPDATE ON public.team
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_order     ON public.team ("order" ASC);
CREATE INDEX IF NOT EXISTS idx_team_active    ON public.team (is_active);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- Anyone can read active team members
DROP POLICY IF EXISTS "Public can read active team members" ON public.team;
CREATE POLICY "Public can read active team members"
  ON public.team FOR SELECT
  USING (is_active = true);

-- Only authenticated admins can insert / update / delete
DROP POLICY IF EXISTS "Admins can manage team" ON public.team;
CREATE POLICY "Admins can manage team"
  ON public.team FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
