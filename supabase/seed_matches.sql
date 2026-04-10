-- ═══════════════════════════════════════════════════════════════
-- TODOS LOS PARTIDOS DEL MUNDIAL 2026 — 104 partidos
-- Grupos: 12 grupos × 6 partidos = 72
-- Fase eliminatoria: 32 = 104 total
--
-- Ejecutar en Supabase SQL Editor.
-- AVISO: borra los partidos existentes y sus pronósticos.
-- ═══════════════════════════════════════════════════════════════

TRUNCATE matches CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- FASE DE GRUPOS
-- ═══════════════════════════════════════════════════════════════

-- ── GRUPO A: México, Jamaica, Polonia, Arabia Saudita ─────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('México',         'Jamaica',         'MX','JM','2026-06-11 21:00:00+00','group','A','Estadio Azteca, Ciudad de México'),
('Polonia',        'Arabia Saudita',  'PL','SA','2026-06-12 02:00:00+00','group','A','AT&T Stadium, Dallas'),
('México',         'Polonia',         'MX','PL','2026-06-19 21:00:00+00','group','A','Estadio Azteca, Ciudad de México'),
('Jamaica',        'Arabia Saudita',  'JM','SA','2026-06-19 18:00:00+00','group','A','SoFi Stadium, Los Ángeles'),
('México',         'Arabia Saudita',  'MX','SA','2026-06-27 22:00:00+00','group','A','Estadio Azteca, Ciudad de México'),
('Jamaica',        'Polonia',         'JM','PL','2026-06-27 22:00:00+00','group','A','Allegiant Stadium, Las Vegas');

-- ── GRUPO B: Estados Unidos, Panamá, Francia, Marruecos ───────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Estados Unidos', 'Panamá',          'US','PA','2026-06-12 18:00:00+00','group','B','MetLife Stadium, Nueva York'),
('Francia',        'Marruecos',       'FR','MA','2026-06-12 21:00:00+00','group','B','Levi''s Stadium, San Francisco'),
('Estados Unidos', 'Francia',         'US','FR','2026-06-20 21:00:00+00','group','B','AT&T Stadium, Dallas'),
('Panamá',         'Marruecos',       'PA','MA','2026-06-20 18:00:00+00','group','B','SoFi Stadium, Los Ángeles'),
('Estados Unidos', 'Marruecos',       'US','MA','2026-06-27 18:00:00+00','group','B','MetLife Stadium, Nueva York'),
('Panamá',         'Francia',         'PA','FR','2026-06-27 18:00:00+00','group','B','Rose Bowl, Los Ángeles');

-- ── GRUPO C: Canadá, Honduras, Alemania, Japón ────────────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Canadá',         'Honduras',        'CA','HN','2026-06-13 18:00:00+00','group','C','BMO Field, Toronto'),
('Alemania',       'Japón',           'DE','JP','2026-06-13 21:00:00+00','group','C','Mercedes-Benz Stadium, Atlanta'),
('Canadá',         'Alemania',        'CA','DE','2026-06-21 21:00:00+00','group','C','BC Place, Vancouver'),
('Honduras',       'Japón',           'HN','JP','2026-06-21 18:00:00+00','group','C','Arrowhead Stadium, Kansas City'),
('Canadá',         'Japón',           'CA','JP','2026-06-28 22:00:00+00','group','C','BMO Field, Toronto'),
('Honduras',       'Alemania',        'HN','DE','2026-06-28 22:00:00+00','group','C','NRG Stadium, Houston');

-- ── GRUPO D: Argentina, Bolivia, Inglaterra, Senegal ──────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Argentina',      'Bolivia',         'AR','BO','2026-06-13 00:00:00+00','group','D','MetLife Stadium, Nueva York'),
('Inglaterra',     'Senegal',         'GB','SN','2026-06-13 23:00:00+00','group','D','Hard Rock Stadium, Miami'),
('Argentina',      'Inglaterra',      'AR','GB','2026-06-21 00:00:00+00','group','D','MetLife Stadium, Nueva York'),
('Bolivia',        'Senegal',         'BO','SN','2026-06-21 23:00:00+00','group','D','Gillette Stadium, Boston'),
('Argentina',      'Senegal',         'AR','SN','2026-06-28 18:00:00+00','group','D','MetLife Stadium, Nueva York'),
('Bolivia',        'Inglaterra',      'BO','GB','2026-06-28 18:00:00+00','group','D','Lincoln Financial Field, Filadelfia');

-- ── GRUPO E: Brasil, Venezuela, España, Corea del Sur ─────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Brasil',         'Venezuela',       'BR','VE','2026-06-14 18:00:00+00','group','E','Lumen Field, Seattle'),
('España',         'Corea del Sur',   'ES','KR','2026-06-14 21:00:00+00','group','E','SoFi Stadium, Los Ángeles'),
('Brasil',         'España',          'BR','ES','2026-06-22 21:00:00+00','group','E','MetLife Stadium, Nueva York'),
('Venezuela',      'Corea del Sur',   'VE','KR','2026-06-22 18:00:00+00','group','E','Levi''s Stadium, San Francisco'),
('Brasil',         'Corea del Sur',   'BR','KR','2026-06-29 22:00:00+00','group','E','Lumen Field, Seattle'),
('Venezuela',      'España',          'VE','ES','2026-06-29 22:00:00+00','group','E','Rose Bowl, Los Ángeles');

-- ── GRUPO F: Uruguay, Ecuador, Portugal, Túnez ────────────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Uruguay',        'Ecuador',         'UY','EC','2026-06-14 00:00:00+00','group','F','Allegiant Stadium, Las Vegas'),
('Portugal',       'Túnez',           'PT','TN','2026-06-14 23:00:00+00','group','F','Arrowhead Stadium, Kansas City'),
('Uruguay',        'Portugal',        'UY','PT','2026-06-22 00:00:00+00','group','F','Hard Rock Stadium, Miami'),
('Ecuador',        'Túnez',           'EC','TN','2026-06-22 23:00:00+00','group','F','NRG Stadium, Houston'),
('Uruguay',        'Túnez',           'UY','TN','2026-06-29 18:00:00+00','group','F','AT&T Stadium, Dallas'),
('Ecuador',        'Portugal',        'EC','PT','2026-06-29 18:00:00+00','group','F','Mercedes-Benz Stadium, Atlanta');

-- ── GRUPO G: Países Bajos, Colombia, Bélgica, Irán ────────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Países Bajos',   'Colombia',        'NL','CO','2026-06-15 18:00:00+00','group','G','Mercedes-Benz Stadium, Atlanta'),
('Bélgica',        'Irán',            'BE','IR','2026-06-15 21:00:00+00','group','G','Gillette Stadium, Boston'),
('Países Bajos',   'Bélgica',         'NL','BE','2026-06-23 21:00:00+00','group','G','MetLife Stadium, Nueva York'),
('Colombia',       'Irán',            'CO','IR','2026-06-23 18:00:00+00','group','G','AT&T Stadium, Dallas'),
('Países Bajos',   'Irán',            'NL','IR','2026-06-30 22:00:00+00','group','G','MetLife Stadium, Nueva York'),
('Colombia',       'Bélgica',         'CO','BE','2026-06-30 22:00:00+00','group','G','Hard Rock Stadium, Miami');

-- ── GRUPO H: Croacia, Chile, Suiza, Nigeria ───────────────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Croacia',        'Chile',           'HR','CL','2026-06-15 00:00:00+00','group','H','Lincoln Financial Field, Filadelfia'),
('Suiza',          'Nigeria',         'CH','NG','2026-06-15 23:00:00+00','group','H','SoFi Stadium, Los Ángeles'),
('Croacia',        'Suiza',           'HR','CH','2026-06-23 00:00:00+00','group','H','Levi''s Stadium, San Francisco'),
('Chile',          'Nigeria',         'CL','NG','2026-06-23 23:00:00+00','group','H','Estadio Azteca, Ciudad de México'),
('Croacia',        'Nigeria',         'HR','NG','2026-06-30 18:00:00+00','group','H','BC Place, Vancouver'),
('Chile',          'Suiza',           'CL','CH','2026-06-30 18:00:00+00','group','H','Allegiant Stadium, Las Vegas');

-- ── GRUPO I: Serbia, Escocia, Camerún, Australia ──────────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Serbia',         'Escocia',         'RS','GB','2026-06-16 18:00:00+00','group','I','Lumen Field, Seattle'),
('Camerún',        'Australia',       'CM','AU','2026-06-16 21:00:00+00','group','I','Arrowhead Stadium, Kansas City'),
('Serbia',         'Camerún',         'RS','CM','2026-06-24 21:00:00+00','group','I','NRG Stadium, Houston'),
('Escocia',        'Australia',       'GB','AU','2026-06-24 18:00:00+00','group','I','Lumen Field, Seattle'),
('Serbia',         'Australia',       'RS','AU','2026-07-01 22:00:00+00','group','I','Gillette Stadium, Boston'),
('Escocia',        'Camerún',         'GB','CM','2026-07-01 22:00:00+00','group','I','BC Place, Vancouver');

-- ── GRUPO J: Dinamarca, Ucrania, Ghana, Nueva Zelanda ─────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Dinamarca',      'Ucrania',         'DK','UA','2026-06-16 00:00:00+00','group','J','Stade de Montréal, Montreal'),
('Ghana',          'Nueva Zelanda',   'GH','NZ','2026-06-16 23:00:00+00','group','J','NRG Stadium, Houston'),
('Dinamarca',      'Ghana',           'DK','GH','2026-06-24 00:00:00+00','group','J','Stade de Montréal, Montreal'),
('Ucrania',        'Nueva Zelanda',   'UA','NZ','2026-06-24 23:00:00+00','group','J','Arrowhead Stadium, Kansas City'),
('Dinamarca',      'Nueva Zelanda',   'DK','NZ','2026-07-01 18:00:00+00','group','J','Stade de Montréal, Montreal'),
('Ucrania',        'Ghana',           'UA','GH','2026-07-01 18:00:00+00','group','J','Mercedes-Benz Stadium, Atlanta');

-- ── GRUPO K: Turquía, Rumania, Rep. Dem. Congo, Iraq ──────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Turquía',        'Rumania',         'TR','RO','2026-06-17 18:00:00+00','group','K','Hard Rock Stadium, Miami'),
('Rep. Congo',     'Iraq',            'CD','IQ','2026-06-17 21:00:00+00','group','K','Lincoln Financial Field, Filadelfia'),
('Turquía',        'Rep. Congo',      'TR','CD','2026-06-25 21:00:00+00','group','K','Levi''s Stadium, San Francisco'),
('Rumania',        'Iraq',            'RO','IQ','2026-06-25 18:00:00+00','group','K','Rose Bowl, Los Ángeles'),
('Turquía',        'Iraq',            'TR','IQ','2026-07-02 22:00:00+00','group','K','AT&T Stadium, Dallas'),
('Rumania',        'Rep. Congo',      'RO','CD','2026-07-02 22:00:00+00','group','K','Hard Rock Stadium, Miami');

-- ── GRUPO L: Perú, Austria, Egipto, Uzbekistán ────────────────
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Perú',           'Austria',         'PE','AT','2026-06-17 00:00:00+00','group','L','Estadio BBVA, Monterrey'),
('Egipto',         'Uzbekistán',      'EG','UZ','2026-06-17 23:00:00+00','group','L','Estadio Akron, Guadalajara'),
('Perú',           'Egipto',          'PE','EG','2026-06-25 00:00:00+00','group','L','Estadio BBVA, Monterrey'),
('Austria',        'Uzbekistán',      'AT','UZ','2026-06-25 23:00:00+00','group','L','Estadio Akron, Guadalajara'),
('Perú',           'Uzbekistán',      'PE','UZ','2026-07-02 18:00:00+00','group','L','Estadio BBVA, Monterrey'),
('Austria',        'Egipto',          'AT','EG','2026-07-02 18:00:00+00','group','L','Estadio Akron, Guadalajara');

-- ═══════════════════════════════════════════════════════════════
-- RONDA DE 32 (equipos por definir)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('1° Grupo A',     '2° Grupo B',      NULL,NULL,'2026-07-04 18:00:00+00','round32',NULL,'MetLife Stadium, Nueva York'),
('1° Grupo C',     '2° Grupo D',      NULL,NULL,'2026-07-04 22:00:00+00','round32',NULL,'AT&T Stadium, Dallas'),
('1° Grupo B',     '2° Grupo A',      NULL,NULL,'2026-07-05 18:00:00+00','round32',NULL,'SoFi Stadium, Los Ángeles'),
('1° Grupo D',     '2° Grupo C',      NULL,NULL,'2026-07-05 22:00:00+00','round32',NULL,'Levi''s Stadium, San Francisco'),
('1° Grupo E',     '2° Grupo F',      NULL,NULL,'2026-07-06 18:00:00+00','round32',NULL,'Mercedes-Benz Stadium, Atlanta'),
('1° Grupo G',     '2° Grupo H',      NULL,NULL,'2026-07-06 22:00:00+00','round32',NULL,'Hard Rock Stadium, Miami'),
('1° Grupo F',     '2° Grupo E',      NULL,NULL,'2026-07-07 18:00:00+00','round32',NULL,'Gillette Stadium, Boston'),
('1° Grupo H',     '2° Grupo G',      NULL,NULL,'2026-07-07 22:00:00+00','round32',NULL,'Arrowhead Stadium, Kansas City'),
('1° Grupo I',     '2° Grupo J',      NULL,NULL,'2026-07-08 18:00:00+00','round32',NULL,'NRG Stadium, Houston'),
('1° Grupo K',     '2° Grupo L',      NULL,NULL,'2026-07-08 22:00:00+00','round32',NULL,'Lumen Field, Seattle'),
('1° Grupo J',     '2° Grupo I',      NULL,NULL,'2026-07-09 18:00:00+00','round32',NULL,'Lincoln Financial Field, Filadelfia'),
('1° Grupo L',     '2° Grupo K',      NULL,NULL,'2026-07-09 22:00:00+00','round32',NULL,'BC Place, Vancouver'),
('3° mejor 1',     '3° mejor 2',      NULL,NULL,'2026-07-10 18:00:00+00','round32',NULL,'Rose Bowl, Los Ángeles'),
('3° mejor 3',     '3° mejor 4',      NULL,NULL,'2026-07-10 22:00:00+00','round32',NULL,'Estadio Azteca, Ciudad de México'),
('3° mejor 5',     '3° mejor 6',      NULL,NULL,'2026-07-11 18:00:00+00','round32',NULL,'Estadio BBVA, Monterrey'),
('3° mejor 7',     '3° mejor 8',      NULL,NULL,'2026-07-11 22:00:00+00','round32',NULL,'Stade de Montréal, Montreal');

-- ═══════════════════════════════════════════════════════════════
-- OCTAVOS DE FINAL
-- ═══════════════════════════════════════════════════════════════
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Ganador R32-1',  'Ganador R32-2',   NULL,NULL,'2026-07-13 18:00:00+00','round16',NULL,'MetLife Stadium, Nueva York'),
('Ganador R32-3',  'Ganador R32-4',   NULL,NULL,'2026-07-13 22:00:00+00','round16',NULL,'AT&T Stadium, Dallas'),
('Ganador R32-5',  'Ganador R32-6',   NULL,NULL,'2026-07-14 18:00:00+00','round16',NULL,'SoFi Stadium, Los Ángeles'),
('Ganador R32-7',  'Ganador R32-8',   NULL,NULL,'2026-07-14 22:00:00+00','round16',NULL,'Levi''s Stadium, San Francisco'),
('Ganador R32-9',  'Ganador R32-10',  NULL,NULL,'2026-07-15 18:00:00+00','round16',NULL,'Mercedes-Benz Stadium, Atlanta'),
('Ganador R32-11', 'Ganador R32-12',  NULL,NULL,'2026-07-15 22:00:00+00','round16',NULL,'Hard Rock Stadium, Miami'),
('Ganador R32-13', 'Ganador R32-14',  NULL,NULL,'2026-07-16 18:00:00+00','round16',NULL,'Arrowhead Stadium, Kansas City'),
('Ganador R32-15', 'Ganador R32-16',  NULL,NULL,'2026-07-16 22:00:00+00','round16',NULL,'Estadio Azteca, Ciudad de México');

-- ═══════════════════════════════════════════════════════════════
-- CUARTOS DE FINAL
-- ═══════════════════════════════════════════════════════════════
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Ganador O1',     'Ganador O2',      NULL,NULL,'2026-07-18 21:00:00+00','quarter',NULL,'MetLife Stadium, Nueva York'),
('Ganador O3',     'Ganador O4',      NULL,NULL,'2026-07-19 18:00:00+00','quarter',NULL,'AT&T Stadium, Dallas'),
('Ganador O5',     'Ganador O6',      NULL,NULL,'2026-07-19 21:00:00+00','quarter',NULL,'SoFi Stadium, Los Ángeles'),
('Ganador O7',     'Ganador O8',      NULL,NULL,'2026-07-20 21:00:00+00','quarter',NULL,'Estadio Azteca, Ciudad de México');

-- ═══════════════════════════════════════════════════════════════
-- SEMIFINALES
-- ═══════════════════════════════════════════════════════════════
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Ganador CF1',    'Ganador CF2',     NULL,NULL,'2026-07-22 21:00:00+00','semi',NULL,'MetLife Stadium, Nueva York'),
('Ganador CF3',    'Ganador CF4',     NULL,NULL,'2026-07-23 21:00:00+00','semi',NULL,'AT&T Stadium, Dallas');

-- ═══════════════════════════════════════════════════════════════
-- TERCER PUESTO Y FINAL
-- ═══════════════════════════════════════════════════════════════
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, stage, group_name, venue) VALUES
('Perdedor SF1',   'Perdedor SF2',    NULL,NULL,'2026-07-25 18:00:00+00','third',NULL,'Hard Rock Stadium, Miami'),
('Ganador SF1',    'Ganador SF2',     NULL,NULL,'2026-07-26 21:00:00+00','final',NULL,'MetLife Stadium, Nueva York');
