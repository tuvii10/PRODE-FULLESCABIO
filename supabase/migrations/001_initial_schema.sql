-- ============================================================
-- PRODE FULLESCABIO MUNDIAL 2026 - Schema Inicial (idempotente)
-- ============================================================

-- ─── EXTENSIONES ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TABLAS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT        UNIQUE NOT NULL,
  username         TEXT        UNIQUE,
  full_name        TEXT,
  avatar_url       TEXT,
  is_admin         BOOLEAN     NOT NULL DEFAULT FALSE,
  is_disqualified  BOOLEAN     NOT NULL DEFAULT FALSE,
  disq_reason      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team    TEXT        NOT NULL,
  away_team    TEXT        NOT NULL,
  home_flag    TEXT,
  away_flag    TEXT,
  match_date   TIMESTAMPTZ NOT NULL,
  stage        TEXT        NOT NULL DEFAULT 'group',
  group_name   TEXT,
  venue        TEXT,
  status       TEXT        NOT NULL DEFAULT 'upcoming'
                CHECK (status IN ('upcoming','live','finished','cancelled')),
  home_score   INTEGER     CHECK (home_score >= 0),
  away_score   INTEGER     CHECK (away_score >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_id         UUID        NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  home_score_pred  INTEGER     NOT NULL CHECK (home_score_pred >= 0),
  away_score_pred  INTEGER     NOT NULL CHECK (away_score_pred >= 0),
  points           INTEGER     NOT NULL DEFAULT 0,
  calculated       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, match_id)
);

CREATE TABLE IF NOT EXISTS bonus_predictions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bonus_type  TEXT        NOT NULL CHECK (bonus_type IN ('champion','runner_up','third')),
  team_name   TEXT        NOT NULL,
  points      INTEGER     NOT NULL DEFAULT 0,
  calculated  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, bonus_type)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  action     TEXT        NOT NULL,
  entity     TEXT,
  entity_id  UUID,
  details    JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournament_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO tournament_settings (key, value) VALUES
  ('status', 'upcoming'),
  ('name',   'Mundial 2026')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Triggers: drop antes de (re)crear para evitar "already exists"
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at    ON profiles;
DROP TRIGGER IF EXISTS trg_matches_updated_at     ON matches;
DROP TRIGGER IF EXISTS trg_predictions_updated_at ON predictions;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_matches_updated_at
  BEFORE UPDATE ON matches  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_predictions_updated_at
  BEFORE UPDATE ON predictions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Calcular puntos ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION calc_points(
  p_home INTEGER, p_away INTEGER,
  m_home INTEGER, m_away INTEGER
) RETURNS INTEGER LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF p_home = m_home AND p_away = m_away THEN RETURN 3; END IF;
  IF (p_home > p_away AND m_home > m_away) OR
     (p_home < p_away AND m_home < m_away) OR
     (p_home = p_away AND m_home = m_away) THEN RETURN 1; END IF;
  RETURN 0;
END;
$$;

-- ─── Recalcular pronósticos de un partido ────────────────────
CREATE OR REPLACE FUNCTION recalculate_match_predictions(p_match_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_home INTEGER;
  v_away INTEGER;
BEGIN
  SELECT home_score, away_score INTO v_home, v_away
  FROM matches WHERE id = p_match_id AND status = 'finished';

  IF v_home IS NULL THEN
    RAISE EXCEPTION 'Partido no finalizado o no encontrado: %', p_match_id;
  END IF;

  UPDATE predictions
  SET
    points     = calc_points(home_score_pred, away_score_pred, v_home, v_away),
    calculated = TRUE
  WHERE match_id = p_match_id;

  INSERT INTO audit_logs (action, entity, entity_id, details)
  VALUES ('recalculate_predictions', 'match', p_match_id,
          jsonb_build_object('home_score', v_home, 'away_score', v_away));
END;
$$;

-- ─── Vista ranking ───────────────────────────────────────────
CREATE OR REPLACE VIEW ranking AS
SELECT
  p.id,
  p.email,
  p.full_name,
  p.username,
  p.avatar_url,
  p.is_disqualified,
  COALESCE(SUM(pr.points), 0)                              AS total_points,
  COUNT(*) FILTER (WHERE pr.points = 3)                    AS exact_results,
  COUNT(*) FILTER (WHERE pr.points = 1)                    AS correct_winner,
  COUNT(*) FILTER (WHERE pr.calculated = TRUE)             AS predictions_scored,
  COUNT(*) FILTER (WHERE pr.id IS NOT NULL)                AS total_predictions,
  MIN(p.created_at)                                        AS registered_at,
  RANK() OVER (
    ORDER BY
      COALESCE(SUM(pr.points), 0)               DESC,
      COUNT(*) FILTER (WHERE pr.points = 3)     DESC,
      COUNT(*) FILTER (WHERE pr.points = 1)     DESC,
      MIN(p.created_at)                         ASC
  ) AS position
FROM profiles p
LEFT JOIN predictions pr ON pr.user_id = p.id
WHERE p.is_disqualified = FALSE
GROUP BY p.id, p.email, p.full_name, p.username, p.avatar_url, p.is_disqualified;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches             ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_predictions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  );
$$;

-- Políticas: drop antes de crear para que sea re-ejecutable
DO $$ BEGIN
  -- profiles
  DROP POLICY IF EXISTS "Todos pueden ver profiles"          ON profiles;
  DROP POLICY IF EXISTS "Usuario actualiza su propio perfil" ON profiles;
  DROP POLICY IF EXISTS "Admin gestiona profiles"            ON profiles;
  -- matches
  DROP POLICY IF EXISTS "Todos ven partidos"                 ON matches;
  DROP POLICY IF EXISTS "Admin gestiona partidos"            ON matches;
  -- predictions
  DROP POLICY IF EXISTS "Todos ven predicciones"                         ON predictions;
  DROP POLICY IF EXISTS "Usuario inserta su predicción"                  ON predictions;
  DROP POLICY IF EXISTS "Usuario actualiza predicción antes del partido" ON predictions;
  DROP POLICY IF EXISTS "Admin gestiona predicciones"                    ON predictions;
  -- bonus_predictions
  DROP POLICY IF EXISTS "Todos ven bonus"           ON bonus_predictions;
  DROP POLICY IF EXISTS "Usuario gestiona su bonus" ON bonus_predictions;
  DROP POLICY IF EXISTS "Admin gestiona bonus"      ON bonus_predictions;
  -- audit_logs
  DROP POLICY IF EXISTS "Solo admin ve audit_logs" ON audit_logs;
  DROP POLICY IF EXISTS "Sistema inserta logs"     ON audit_logs;
  -- tournament_settings
  DROP POLICY IF EXISTS "Todos ven settings"      ON tournament_settings;
  DROP POLICY IF EXISTS "Admin modifica settings" ON tournament_settings;
END $$;

-- ── profiles ──
CREATE POLICY "Todos pueden ver profiles"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuario actualiza su propio perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin gestiona profiles"
  ON profiles FOR ALL USING (is_admin());

-- ── matches ──
CREATE POLICY "Todos ven partidos"
  ON matches FOR SELECT USING (true);
CREATE POLICY "Admin gestiona partidos"
  ON matches FOR ALL USING (is_admin());

-- ── predictions ──
CREATE POLICY "Todos ven predicciones"
  ON predictions FOR SELECT USING (true);
CREATE POLICY "Usuario inserta su predicción"
  ON predictions FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT is_admin()
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_id
        AND status = 'upcoming'
        AND match_date > NOW()
    )
    AND NOT EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_disqualified = TRUE
    )
  );
CREATE POLICY "Usuario actualiza predicción antes del partido"
  ON predictions FOR UPDATE USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_id
        AND status = 'upcoming'
        AND match_date > NOW()
    )
  );
CREATE POLICY "Admin gestiona predicciones"
  ON predictions FOR ALL USING (is_admin());

-- ── bonus_predictions ──
CREATE POLICY "Todos ven bonus"
  ON bonus_predictions FOR SELECT USING (true);
CREATE POLICY "Usuario gestiona su bonus"
  ON bonus_predictions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin gestiona bonus"
  ON bonus_predictions FOR ALL USING (is_admin());

-- ── audit_logs ──
CREATE POLICY "Solo admin ve audit_logs"
  ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "Sistema inserta logs"
  ON audit_logs FOR INSERT WITH CHECK (true);

-- ── tournament_settings ──
CREATE POLICY "Todos ven settings"
  ON tournament_settings FOR SELECT USING (true);
CREATE POLICY "Admin modifica settings"
  ON tournament_settings FOR ALL USING (is_admin());

-- ─── ÍNDICES (IF NOT EXISTS) ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_predictions_user_id  ON predictions (user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON predictions (match_id);
CREATE INDEX IF NOT EXISTS idx_matches_match_date   ON matches (match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status       ON matches (status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id   ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created   ON audit_logs (created_at DESC);
