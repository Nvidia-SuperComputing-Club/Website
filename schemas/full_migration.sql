-- ============================================================
-- NVIDIA Supercomputing Club — Full Database Migration
-- Safe to re-run: uses IF NOT EXISTS + drops existing policies
-- ============================================================

-- Shared utility trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $func$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$func$;

-- ============================================================
-- TABLE: events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  description      TEXT,
  date             DATE        NOT NULL,
  time             TEXT,
  location         TEXT,
  type             TEXT        DEFAULT 'event'
                   CHECK (type IN ('event', 'workshop', 'hackathon', 'seminar', 'competition')),
  image_url        TEXT,
  registration_url TEXT,
  is_featured      BOOLEAN     NOT NULL DEFAULT false,
  is_published     BOOLEAN     NOT NULL DEFAULT false,
  capacity         INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS events_set_updated_at ON public.events;
CREATE TRIGGER events_set_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_events_date      ON public.events (date ASC);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events (is_published);
CREATE INDEX IF NOT EXISTS idx_events_featured  ON public.events (is_featured);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published events" ON public.events;
CREATE POLICY "Public can read published events"
  ON public.events FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: team
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  role         TEXT        NOT NULL,
  department   TEXT,
  year         TEXT,
  bio          TEXT,
  avatar_url   TEXT,
  linkedin_url TEXT,
  github_url   TEXT,
  email        TEXT,
  "order"      INTEGER     NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS team_set_updated_at ON public.team;
CREATE TRIGGER team_set_updated_at
  BEFORE UPDATE ON public.team
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_team_order  ON public.team ("order" ASC);
CREATE INDEX IF NOT EXISTS idx_team_active ON public.team (is_active);

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active team members" ON public.team;
CREATE POLICY "Public can read active team members"
  ON public.team FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage team" ON public.team;
CREATE POLICY "Admins can manage team"
  ON public.team FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: applications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  phone         TEXT,
  enrollment_no TEXT,
  branch        TEXT,
  year          TEXT,
  why_join      TEXT,
  experience    TEXT,
  linkedin_url  TEXT,
  github_url    TEXT,
  portfolio_url TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS applications_set_updated_at ON public.applications;
CREATE TRIGGER applications_set_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_applications_status     ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_email      ON public.applications (email);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
CREATE POLICY "Anyone can submit an application"
  ON public.applications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read applications" ON public.applications;
CREATE POLICY "Admins can read applications"
  ON public.applications FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;
CREATE POLICY "Admins can delete applications"
  ON public.applications FOR DELETE
  USING (auth.role() = 'authenticated');
