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
('Universidade Federal de Minas Gerais', 'UFMG-Centro', -19.9257, -43.9366),
('Universidade Federal de Minas Gerais', 'UFMG-Pampulha', -19.8719, -43.9625),
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
('Ricardo Amorim', '07777575686', 'joao@example.com', '31971690890', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU6LJhJoA8NuNOdrYyLYEs-ne66rGSsHc_IVFv_OQpYtzKuQe5JLo_WVMYFc51wu8yGk8'),
('Maria Oliveira', '22222222222', 'maria@example.com', '31988888888', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU6LJhJoA8NuNOdrYyLYEs-ne66rGSsHc_IVFv_OQpYtzKuQe5JLo_WVMYFc51wu8yGk8'),
('Carlos Pereira', '33333333333', 'carlos@example.com', '31977777777', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU6LJhJoA8NuNOdrYyLYEs-ne66rGSsHc_IVFv_OQpYtzKuQe5JLo_WVMYFc51wu8yGk8');

TRUNCATE TABLE announcement RESTART IDENTITY CASCADE;
INSERT INTO announcement (id_owner, price, occupants, max_occupants, description, type_of, status, title, sex_restriction, rules)
VALUES
(1, 1200.00, 0, 2, 'Kitnet aconchegante próxima à universidade', 'kitnet', 'available', 'Kitnet Estudantil', 'both', 'Não fumar'),
(2, 800.00, 1, 1, 'Quarto individual, mobiliado', 'individual_room', 'available', 'Quarto Individual', 'female', 'Animais de estimação não permitidos'),
(3, 1500.00, 0, 3, 'Apartamento compartilhado com 3 quartos', 'shared_room', 'available', 'Apartamento Compartilhado', 'both', 'Limite de ocupantes máximo: 3');

TRUNCATE TABLE announcement_img RESTART IDENTITY CASCADE;
INSERT INTO announcement_img (id_announcement, img_url, order_idx, is_cover)
VALUES
(1, 'https://resizedimgs.zapimoveis.com.br/img/vr-listing/9a8cec0f41772f9642b8ae01dab2cfc5/apartamento-com-2-quartos-para-venda-ou-aluguel-65m-no-centro-jacarei.webp?action=fit-in&dimension=870x707', 0, true),
(1, 'https://resizedimgs.zapimoveis.com.br/img/vr-listing/324a646a5590b7700e5beafc483af2a9/apartamento-com-2-quartos-para-venda-ou-aluguel-65m-no-centro-jacarei.webp?action=fit-in&dimension=870x707', 1, false),
(1, 'https://resizedimgs.zapimoveis.com.br/img/vr-listing/0a2481e419c72ba00869a4c41f8284eb/apartamento-com-2-quartos-para-venda-ou-aluguel-65m-no-centro-jacarei.webp?action=fit-in&dimension=870x707', 2, false),
(2, 'https://fastly.picsum.photos/id/25/5000/3333.jpg?hmac=yCz9LeSs-i72Ru0YvvpsoECnCTxZjzGde805gWrAHkM', 0, true),
(3, 'https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU', 0, true),
(3, 'https://fastly.picsum.photos/id/28/4928/3264.jpg?hmac=GnYF-RnBUg44PFfU5pcw_Qs0ReOyStdnZ8MtQWJqTfA', 1, false),
(3, 'https://fastly.picsum.photos/id/27/3264/1836.jpg?hmac=p3BVIgKKQpHhfGRRCbsi2MCAzw8mWBCayBsKxxtWO8g', 2, false);


COMMIT;
