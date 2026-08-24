-- ============================================================
-- TABLE: homepage_content
-- ============================================================
CREATE TABLE IF NOT EXISTS public.homepage_content (
  section       TEXT PRIMARY KEY,
  body          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Turn on Row Level Security
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can read homepage content
CREATE POLICY "Public can read homepage content"
  ON public.homepage_content
  FOR SELECT
  USING (true);

-- 2. Only authenticated admins can modify homepage content
CREATE POLICY "Admins can insert homepage content"
  ON public.homepage_content
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update homepage content"
  ON public.homepage_content
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Attach updated_at trigger
CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Insert initial empty data for the sections
INSERT INTO public.homepage_content (section, body) VALUES 
('hero', '{}'::jsonb),
('about', '{}'::jsonb),
('stats', '{}'::jsonb),
('footer', '{}'::jsonb)
ON CONFLICT (section) DO NOTHING;
