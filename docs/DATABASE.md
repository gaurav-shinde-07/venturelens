-- ============================================
-- VentureAI Database Schema
-- Run this entire block in Supabase SQL Editor
-- ============================================

-- ---- Profiles Table ----
-- Automatically created when a user signs up
-- Mirrors auth.users with extra profile fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ---- Ideas Table ----
CREATE TABLE IF NOT EXISTS public.ideas (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 100),
  description      TEXT NOT NULL CHECK (char_length(description) >= 20),
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  -- AI-generated fields (NULL until analysis completes)
  problem          TEXT,
  customer         TEXT,
  market           TEXT,
  competitor       JSONB,
  tech_stack       JSONB,
  risk_level       TEXT CHECK (risk_level IN ('Low', 'Medium', 'High')),
  profitability    INTEGER CHECK (profitability >= 0 AND profitability <= 100),
  justification    TEXT,
  -- Share functionality
  share_token      UUID DEFAULT gen_random_uuid() NOT NULL,
  is_public        BOOLEAN DEFAULT FALSE NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ---- Indexes for performance ----
CREATE INDEX IF NOT EXISTS ideas_user_id_idx ON public.ideas(user_id);
CREATE INDEX IF NOT EXISTS ideas_status_idx ON public.ideas(status);
CREATE INDEX IF NOT EXISTS ideas_share_token_idx ON public.ideas(share_token);
CREATE INDEX IF NOT EXISTS ideas_created_at_idx ON public.ideas(created_at DESC);

-- ---- Auto-update updated_at trigger ----
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---- Auto-create profile on signup trigger ----
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Row Level Security (RLS) Policies
-- Users can ONLY access their own data
-- ============================================

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- ---- Profiles RLS Policies ----
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ---- Ideas RLS Policies ----
CREATE POLICY "Users can view own ideas"
  ON public.ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public ideas (share links)"
  ON public.ideas FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can insert own ideas"
  ON public.ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON public.ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON public.ideas FOR DELETE
  USING (auth.uid() = user_id);