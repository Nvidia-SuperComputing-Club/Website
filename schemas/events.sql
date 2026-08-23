-- ============================================================
-- TABLE: events
-- Description: Club events, workshops, hackathons, and seminars
-- ============================================================

CREATE TABLE IF NOT EXISTS public.events (
  id            UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT                     NOT NULL,
  description   TEXT,
  date          DATE                     NOT NULL,
  time          TEXT,                    -- e.g. "10:00 AM IST"
  location      TEXT,
  type          TEXT                     DEFAULT 'event'
                CHECK (type IN ('event', 'workshop', 'hackathon', 'seminar', 'competition')),
  image_url     TEXT,
  registration_url TEXT,
  is_featured   BOOLEAN                  NOT NULL DEFAULT false,
  is_published  BOOLEAN                  NOT NULL DEFAULT false,
  capacity      INTEGER,
  created_at    TIMESTAMPTZ              NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ              NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_set_updated_at ON public.events;
CREATE TRIGGER events_set_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_date       ON public.events (date ASC);
CREATE INDEX IF NOT EXISTS idx_events_published  ON public.events (is_published);
CREATE INDEX IF NOT EXISTS idx_events_featured   ON public.events (is_featured);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone can read published events
DROP POLICY IF EXISTS "Public can read published events" ON public.events;
CREATE POLICY "Public can read published events"
  ON public.events FOR SELECT
  USING (is_published = true);

-- Only authenticated admins can insert / update / delete
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
