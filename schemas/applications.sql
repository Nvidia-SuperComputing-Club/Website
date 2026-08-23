-- ============================================================
-- TABLE: applications
-- Description: Membership / join requests submitted via the Join page
-- ============================================================

CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT                   NOT NULL,
  email           TEXT                   NOT NULL,
  phone           TEXT,
  enrollment_no   TEXT,
  branch          TEXT,
  year            TEXT,
  why_join        TEXT,                  -- Why do you want to join?
  experience      TEXT,                  -- Prior experience / skills
  linkedin_url    TEXT,
  github_url      TEXT,
  portfolio_url   TEXT,
  status          TEXT                   NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  admin_notes     TEXT,                  -- Internal reviewer notes
  created_at      TIMESTAMPTZ            NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ            NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
DROP TRIGGER IF EXISTS applications_set_updated_at ON public.applications;
CREATE TRIGGER applications_set_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_status      ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at  ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_email       ON public.applications (email);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous) can submit a new application (INSERT only)
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
CREATE POLICY "Anyone can submit an application"
  ON public.applications FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can read all applications
DROP POLICY IF EXISTS "Admins can read applications" ON public.applications;
CREATE POLICY "Admins can read applications"
  ON public.applications FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated admins can update status / notes
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated admins can delete applications
DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;
CREATE POLICY "Admins can delete applications"
  ON public.applications FOR DELETE
  USING (auth.role() = 'authenticated');
