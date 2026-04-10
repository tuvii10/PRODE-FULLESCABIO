-- ============================================================
-- SEED: Partidos de ejemplo - Mundial 2026
-- Fase de grupos - primeras fechas
-- ============================================================

INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
-- Grupo A
('México',    'Polonia',    'MX', 'PL', '2026-06-11 19:00:00+00', 'group', 'A', 'SoFi Stadium, Los Angeles'),
('Arabia S.', 'Argentina',  'SA', 'AR', '2026-06-11 22:00:00+00', 'group', 'A', 'Lusail Stadium'),
('Argentina', 'México',     'AR', 'MX', '2026-06-15 22:00:00+00', 'group', 'A', 'Estadio Azteca'),
('Polonia',   'Arabia S.',  'PL', 'SA', '2026-06-15 19:00:00+00', 'group', 'A', 'Education City Stadium'),

-- Grupo B
('Inglaterra','Estados U.', 'GB', 'US', '2026-06-12 19:00:00+00', 'group', 'B', 'AT&T Stadium, Dallas'),
('Irán',      'Gales',      'IR', 'GB', '2026-06-12 16:00:00+00', 'group', 'B', 'Ahmad Bin Ali Stadium'),
('Gales',     'Inglaterra', 'GB', 'GB', '2026-06-17 19:00:00+00', 'group', 'B', 'Ahmed Bin Ali Stadium'),

-- Grupo C
('Brasil',    'Serbia',     'BR', 'RS', '2026-06-13 19:00:00+00', 'group', 'C', 'Lusail Stadium'),
('Suiza',     'Camerún',    'CH', 'CM', '2026-06-13 16:00:00+00', 'group', 'C', 'Al Janoub Stadium'),
('Camerún',   'Brasil',     'CM', 'BR', '2026-06-17 22:00:00+00', 'group', 'C', 'Lusail Stadium'),

-- Grupo D
('Francia',   'Australia',  'FR', 'AU', '2026-06-14 16:00:00+00', 'group', 'D', 'Al Janoub Stadium'),
('Dinamarca', 'Túnez',      'DK', 'TN', '2026-06-14 13:00:00+00', 'group', 'D', 'Education City Stadium'),

-- Grupo E
('España',    'Costa Rica', 'ES', 'CR', '2026-06-14 22:00:00+00', 'group', 'E', 'Al Thumama Stadium'),
('Alemania',  'Japón',      'DE', 'JP', '2026-06-14 19:00:00+00', 'group', 'E', 'Khalifa Intl Stadium'),

-- Grupo F
('Bélgica',   'Canadá',     'BE', 'CA', '2026-06-15 16:00:00+00', 'group', 'F', 'Ahmad Bin Ali Stadium'),
('Marruecos', 'Croacia',    'MA', 'HR', '2026-06-15 13:00:00+00', 'group', 'F', 'Al Bayt Stadium'),

-- Grupo G
('Brasil',    'Serbia',     'BR', 'RS', '2026-06-24 19:00:00+00', 'group', 'G', 'Lusail Stadium'),
('Uruguay',   'Corea Sur',  'UY', 'KR', '2026-06-24 19:00:00+00', 'group', 'G', 'Education City Stadium'),

-- Grupo H
('Portugal',  'Ghana',      'PT', 'GH', '2026-06-24 22:00:00+00', 'group', 'H', 'Stadium 974'),
('Uruguay',   'Corea Sur',  'UY', 'KR', '2026-06-24 16:00:00+00', 'group', 'H', 'Education City Stadium');
