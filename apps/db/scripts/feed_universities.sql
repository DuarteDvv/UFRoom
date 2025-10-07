-- Seed script to populate the `university` table with reference data for development/testing
-- Usage example (from repo root):
--   psql "$DATABASE_URL" -f apps/db/scripts/feed_universities.sql

BEGIN;

TRUNCATE TABLE university RESTART IDENTITY CASCADE;

INSERT INTO university (name, abbreviation, latitude, longitude) VALUES
('Universidade de São Paulo', 'USP', -23.5558, -46.7319),
('Universidade Estadual de Campinas', 'UNICAMP', -22.8205, -47.0659),
('Universidade Estadual Paulista', 'UNESP', -22.7254, -47.6478),
('Pontifícia Universidade Católica de São Paulo', 'PUC-SP', -23.6006, -46.6686),
('Universidade Federal de São Paulo', 'UNIFESP', -23.5983, -46.6711),
('Universidade Federal de São Carlos', 'UFSCar', -21.9847, -47.8814),
('Universidade Federal do ABC', 'UFABC', -23.6442, -46.5739),
('Universidade Federal do Rio de Janeiro', 'UFRJ', -22.8625, -43.2244),
('Universidade Federal Fluminense', 'UFF', -22.9037, -43.1319),
('Universidade do Estado do Rio de Janeiro', 'UERJ', -22.9119, -43.2364),
('Pontifícia Universidade Católica do Rio de Janeiro', 'PUC-Rio', -22.9792, -43.2331),
('Universidade Federal Rural do Rio de Janeiro', 'UFRRJ', -22.7617, -43.6847),
('Universidade Federal de Minas Gerais - Campus Centro', 'UFMG-Centro', -19.9257, -43.9366),
('Universidade Federal de Minas Gerais - Campus Pampulha', 'UFMG-Pampulha', -19.8719, -43.9625),
('Universidade Federal de Viçosa', 'UFV', -20.7622, -42.8722),
('Universidade Federal de Uberlândia', 'UFU', -18.9189, -48.2578),
('Universidade Federal de Juiz de Fora', 'UFJF', -21.7806, -43.3672),
('Universidade Federal de Ouro Preto', 'UFOP', -20.3858, -43.5036),
('Universidade Federal de Lavras', 'UFLA', -21.2306, -44.9747),
('Pontifícia Universidade Católica de Minas Gerais', 'PUC-MG', -19.9319, -43.9936),
('Universidade de Brasília', 'UnB', -15.7631, -47.8708),
('Universidade Federal do Rio Grande do Sul', 'UFRGS', -30.0733, -51.1195),
('Universidade Federal de Santa Maria', 'UFSM', -29.7206, -53.7147),
('Universidade Federal de Pelotas', 'UFPel', -31.7717, -52.3425),
('Pontifícia Universidade Católica do Rio Grande do Sul', 'PUCRS', -30.0589, -51.1731),
('Universidade Federal do Paraná', 'UFPR', -25.4489, -49.2311),
('Universidade Estadual de Londrina', 'UEL', -23.3269, -51.2050),
('Universidade Estadual de Maringá', 'UEM', -23.4056, -51.9383),
('Universidade Tecnológica Federal do Paraná', 'UTFPR', -25.4306, -49.2728),
('Universidade Federal de Santa Catarina', 'UFSC', -27.6019, -48.5197),
('Universidade do Estado de Santa Catarina', 'UDESC', -27.5839, -48.5181),
('Universidade Federal da Bahia', 'UFBA', -12.9994, -38.5092),
('Universidade Estadual de Feira de Santana', 'UEFS', -12.1958, -38.9656),
('Universidade Federal de Pernambuco', 'UFPE', -8.0522, -34.9511),
('Universidade Federal Rural de Pernambuco', 'UFRPE', -8.0106, -34.9481),
('Universidade Federal do Ceará', 'UFC', -3.7453, -38.5742),
('Universidade Federal de Goiás', 'UFG', -16.6050, -49.2664),
('Universidade Federal do Pará', 'UFPA', -1.4742, -48.4508),
('Universidade Federal do Amazonas', 'UFAM', -3.0939, -59.9639),
('Universidade Federal do Espírito Santo', 'UFES', -20.2769, -40.3053),
('Universidade Federal de Mato Grosso', 'UFMT', -15.6083, -56.0861),
('Universidade Federal da Paraíba', 'UFPB', -7.1372, -34.8456),
('Universidade Federal do Rio Grande do Norte', 'UFRN', -5.8361, -35.2039),
('Universidade Federal de Sergipe', 'UFS', -10.9272, -37.0731),
('Universidade Federal de Alagoas', 'UFAL', -9.5578, -35.7703),
('Universidade Federal do Maranhão', 'UFMA', -2.5608, -44.3069),
('Universidade Federal do Piauí', 'UFPI', -5.0589, -42.8042),
('Universidade Federal do Tocantins', 'UFT', -10.1847, -48.3336),
('Universidade Federal de Rondônia', 'UNIR', -8.8339, -63.9439),
('Universidade Federal do Acre', 'UFAC', -9.9742, -67.8244),
('Universidade Federal de Roraima', 'UFRR', 2.8197, -60.6764),
('Universidade Federal do Amapá', 'UNIFAP', 0.0389, -51.0664),
('Universidade Federal de Mato Grosso do Sul', 'UFMS', -20.5019, -54.6150),
('Instituto Tecnológico de Aeronáutica', 'ITA', -23.2108, -45.8647),
('Instituto Militar de Engenharia', 'IME', -22.8456, -43.2433);

TRUNCATE TABLE owner RESTART IDENTITY CASCADE;

INSERT INTO owner (name, cpf, email, phone, img_url)
VALUES
-- Homens
('Ricardo Amorim', '07777575686', 'ricardo@example.com', '31971690890', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/man1.png'),
('Carlos Pereira', '33333333333', 'carlos@example.com', '31977777777', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/man2.png'),
('João Silva', '44444444444', 'joao@example.com', '31966666666', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/man3.png'),
('Pedro Santos', '55555555555', 'pedro@example.com', '31955555555', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/man4.png'),

-- Mulheres
('Maria Oliveira', '22222222222', 'maria@example.com', '31988888888', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/female1.png'),
('Ana Costa', '66666666666', 'ana@example.com', '31944444444', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/female2.png'),
('Beatriz Lima', '77777777777', 'beatriz@example.com', '31933333333', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/female3.png'),
('Fernanda Rocha', '88888888888', 'fernanda@example.com', '31922222222', 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/pessoas/female4.png');

TRUNCATE TABLE announcement RESTART IDENTITY CASCADE;
INSERT INTO announcement (id_owner, price, occupants, max_occupants, description, type_of, status, title, sex_restriction, rules)
VALUES
(1, 1200.00, 0, 1, 'Kitnet aconchegante próxima à universidade', 'kitnet', 'available', 'Kitnet Estudantil', 'both', 'Não fumar'),
(2, 1300.00, 1, 2, 'Kitnet moderna com varanda', 'kitnet', 'available', 'Kitnet com Varanda', 'both', 'Não animais'),
(3, 1100.00, 0, 3, 'Kitnet silenciosa, ideal para estudar', 'kitnet', 'available', 'Kitnet Silenciosa', 'both', 'Não fumar'),
(1, 1250.00, 0, 4, 'Kitnet mobiliada próxima ao metrô', 'kitnet', 'available', 'Kitnet Mobiliada', 'both', 'Sem festas'),
(2, 1400.00, 0, 5, 'Kitnet com cozinha equipada', 'kitnet', 'available', 'Kitnet Cozinha', 'both', 'Não fumar'),
(3, 1150.00, 1, 6, 'Kitnet compacta e bem iluminada', 'kitnet', 'available', 'Kitnet Compacta', 'both', 'Sem animais'),
(1, 1350.00, 0, 7, 'Kitnet próxima a comércio e transporte', 'kitnet', 'available', 'Kitnet Central', 'both', 'Não fumar'),

(2, 800.00, 1, 8, 'Quarto individual, mobiliado', 'individual_room', 'available', 'Quarto Individual', 'female', 'Animais de estimação não permitidos'),
(3, 850.00, 0, 13, 'Quarto para estudante', 'individual_room', 'available', 'Quarto Estudante', 'male', 'Não fumar'),
(1, 900.00, 1, 2, 'Quarto com armário grande', 'individual_room', 'available', 'Quarto com Armário', 'both', 'Sem festas'),
(2, 700.00, 0, 3, 'Quarto em apartamento compartilhado', 'shared_room', 'available', 'Quarto Compartilhado', 'both', 'Limite de ocupantes máximo: 2'),
(3, 750.00, 0, 4, 'Quarto compartilhado próximo à faculdade', 'shared_room', 'available', 'Quarto Compartilhado 3', 'both', 'Limite de ocupantes máximo: 3'),
(1, 800.00, 0, 5, 'Quarto tranquilo e mobiliado', 'shared_room', 'available', 'Quarto Tranquilo', 'both', 'Não fumar'),
(2, 950.00, 1, 6, 'Quarto individual com cama queen', 'individual_room', 'available', 'Quarto Queen', 'female', 'Não animais'),
(3, 700.00, 0, 7, 'Quarto simples, bem iluminado', 'individual_room', 'available', 'Quarto Simples', 'male', 'Sem festas'),
(1, 820.00, 0, 8, 'Quarto em apartamento compartilhado', 'shared_room', 'available', 'Quarto Compartilhado 2', 'both', 'Limite de ocupantes máximo: 2'),
(2, 780.00, 0, 9, 'Quarto compartilhado com 2 colegas', 'shared_room', 'available', 'Quarto Compartilhado 4', 'both', 'Limite de ocupantes máximo: 3'),
(3, 870.00, 0, 10, 'Quarto individual mobiliado', 'individual_room', 'available', 'Quarto Individual 2', 'female', 'Não fumar'),
(1, 900.00, 1, 11, 'Quarto moderno e silencioso', 'individual_room', 'available', 'Quarto Moderno', 'both', 'Sem animais'),
(2, 760.00, 0, 12, 'Quarto compartilhado com vista para o parque', 'shared_room', 'available', 'Quarto Compartilhado Vista', 'both', 'Limite de ocupantes máximo: 2');


TRUNCATE TABLE announcement_img RESTART IDENTITY CASCADE;
INSERT INTO announcement_img (id_announcement, img_url, order_idx, is_cover)
VALUES
(1, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/1/1.png', 0, true),
(1, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/1/2.png', 1, false),
(1, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/1/3.png', 2, false),
(1, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/1/4.png', 3, false),
(1, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/1/5.png', 4, false),

-- Anúncio 2
(2, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/2/1.png', 0, true),
(2, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/2/2.png', 1, false),
(2, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/2/3.png', 2, false),
(2, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/2/4.png', 3, false),
(2, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/2/5.png', 4, false),

-- Anúncio 3
(3, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/3/1.png', 0, true),
(3, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/3/2.png', 1, false),
(3, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/3/3.png', 2, false),
(3, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/3/4.png', 3, false),
(3, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/3/5.png', 4, false),

-- Anúncio 4
(4, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/4/1.png', 0, true),
(4, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/4/2.png', 1, false),
(4, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/4/3.png', 2, false),
(4, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/4/4.png', 3, false),
(4, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/4/5.png', 4, false),

-- Anúncio 5
(5, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/5/1.png', 0, true),
(5, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/5/2.png', 1, false),
(5, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/5/3.png', 2, false),
(5, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/5/4.png', 3, false),
(5, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/5/5.png', 4, false),

-- Anúncio 6
(6, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/6/1.png', 0, true),
(6, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/6/2.png', 1, false),
(6, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/6/3.png', 2, false),
(6, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/6/4.png', 3, false),
(6, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/6/5.png', 4, false),

-- Anúncio 7
(7, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/7/1.png', 0, true),
(7, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/7/2.png', 1, false),
(7, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/7/3.png', 2, false),
(7, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/7/4.png', 3, false),
(7, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/kitnets/7/5.png', 4, false),

-- Quartos (13 anúncios, 5 imagens cada)
-- Anúncio 8
(8, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/1/1.png', 0, true),
(8, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/1/2.png', 1, false),
(8, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/1/3.png', 2, false),
(8, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/1/4.png', 3, false),
(8, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/1/5.png', 4, false),

-- Anúncio 9
(9, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/2/1.png', 0, true),
(9, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/2/2.png', 1, false),
(9, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/2/3.png', 2, false),
(9, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/2/4.png', 3, false),
(9, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/2/5.png', 4, false),

-- Anúncio 10
(10, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/3/1.png', 0, true),
(10, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/3/2.png', 1, false),
(10, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/3/3.png', 2, false),
(10, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/3/4.png', 3, false),
(10, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/3/5.png', 4, false),

-- Anúncio 11
(11, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/4/1.png', 0, true),
(11, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/4/2.png', 1, false),
(11, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/4/3.png', 2, false),
(11, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/4/4.png', 3, false),
(11, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/4/5.png', 4, false),

-- Anúncio 12
(12, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/5/1.png', 0, true),
(12, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/5/2.png', 1, false),
(12, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/5/3.png', 2, false),
(12, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/5/4.png', 3, false),
(12, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/5/5.png', 4, false),

-- Anúncio 13
(13, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/6/1.png', 0, true),
(13, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/6/2.png', 1, false),
(13, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/6/3.png', 2, false),
(13, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/6/4.png', 3, false),
(13, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/6/5.png', 4, false),

-- Anúncio 14
(14, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/7/1.png', 0, true),
(14, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/7/2.png', 1, false),
(14, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/7/3.png', 2, false),
(14, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/7/4.png', 3, false),
(14, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/7/5.png', 4, false),

-- Anúncio 15
(15, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/8/1.png', 0, true),
(15, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/8/2.png', 1, false),
(15, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/8/3.png', 2, false),
(15, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/8/4.png', 3, false),
(15, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/8/5.png', 4, false),

-- Anúncio 16
(16, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/9/1.png', 0, true),
(16, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/9/2.png', 1, false),
(16, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/9/3.png', 2, false),
(16, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/9/4.png', 3, false),
(16, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/9/5.png', 4, false),

-- Anúncio 17
(17, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/10/1.png', 0, true),
(17, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/10/2.png', 1, false),
(17, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/10/3.png', 2, false),
(17, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/10/4.png', 3, false),
(17, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/10/5.png', 4, false),

-- Anúncio 18
(18, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/11/1.png', 0, true),
(18, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/11/2.png', 1, false),
(18, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/11/3.png', 2, false),
(18, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/11/4.png', 3, false),
(18, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/11/5.png', 4, false),

-- Anúncio 19
(19, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/12/1.png', 0, true),
(19, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/12/2.png', 1, false),
(19, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/12/3.png', 2, false),
(19, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/12/4.png', 3, false),
(19, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/12/5.png', 4, false),

-- Anúncio 20
(20, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/13/1.png', 0, true),
(20, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/13/2.png', 1, false),
(20, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/13/3.png', 2, false),
(20, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/13/4.png', 3, false),
(20, 'https://storage.googleapis.com/ufroom-b774b.firebasestorage.app/quartos/13/5.png', 4, false);

TRUNCATE TABLE announcement_university RESTART IDENTITY CASCADE;

INSERT INTO announcement_university (id_announcement, id_university, distance) VALUES
(1, 13, 1.2),  -- UFMG-Centro
(1, 14, 3.0),  -- UFMG-Pampulha
(2, 13, 0.8),
(2, 14, 2.5),
(3, 13, 1.5),
(3, 14, 2.0),
(4, 13, 2.1),
(4, 14, 1.8),
(5, 13, 0.9),
(5, 14, 3.2),
(6, 13, 1.0),
(6, 14, 2.7),
(7, 13, 1.3),
(7, 14, 2.1);

INSERT INTO announcement_university (id_announcement, id_university, distance) VALUES
(8, 13, 1.0), (8, 14, 2.5),
(9, 13, 0.7), (9, 14, 2.8),
(10, 13, 1.4), (10, 14, 3.1),
(11, 13, 1.2), (11, 14, 2.9),
(12, 13, 0.9), (12, 14, 2.6),
(13, 13, 1.5), (13, 14, 2.2),
(14, 13, 1.3), (14, 14, 2.0),
(15, 13, 1.1), (15, 14, 2.7),
(16, 13, 1.2), (16, 14, 2.9),
(17, 13, 1.0), (17, 14, 3.0),
(18, 13, 1.3), (18, 14, 2.1),
(19, 13, 1.4), (19, 14, 2.5),
(20, 13, 1.2), (20, 14, 2.8);



COMMIT;
