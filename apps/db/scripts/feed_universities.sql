-- Seed script to populate the `university` table with reference data for development/testing
-- Usage example (from repo root):
--   psql "$DATABASE_URL" -f apps/db/scripts/feed_universities.sql

BEGIN;

TRUNCATE TABLE university RESTART IDENTITY CASCADE;

INSERT INTO university (name, abbreviation, latitude, longitude) VALUES
    ('Universidade Federal de Minas Gerais', 'UFMG', -19.869089, -43.966383),
    ('Universidade Federal do Rio de Janeiro', 'UFRJ', -22.858639, -43.232278),
    ('Pontifícia Universidade Católica de Minas Gerais', 'PUC-MINAS', -19.923333, -43.990278);

COMMIT;
