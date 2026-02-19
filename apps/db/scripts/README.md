# Scripts de Banco de Dados - UFRoom 🗄️

Scripts SQL para inicialização, seed e manutenção do banco de dados PostgreSQL do UFRoom.

## 📋 Sumário

- [Scripts Disponíveis](#-scripts-disponíveis)
- [Pré-requisitos](#-pré-requisitos)
- [Feed Universities](#-feed-universities)
- [Outros Scripts](#-outros-scripts)
- [Procedimentos Comuns](#-procedimentos-comuns)

## 📄 Scripts Disponíveis

### `feed_universities.sql`

Script principal de seed que popula o banco com dados de exemplo para desenvolvimento e testes.

**Dados criados:**
- ✅ **55 universidades brasileiras** (federais e estaduais)
- ✅ **8 proprietários** (owners) com senhas hasheadas
- ✅ **20 anúncios** distribuídos entre os proprietários
- ✅ **100 imagens** de anúncios (via Firebase Storage)
- ✅ **8 endereços** em cidades universitárias com coordenadas reais

**Cidades incluídas:**
- Belo Horizonte, MG (UFMG)
- São Paulo, SP (USP, PUC-SP)
- Rio de Janeiro, RJ (UFRJ)
- Fortaleza, CE (UFC)
- Curitiba, PR (UFPR)
- Porto Alegre, RS (UFRGS)

## ✅ Pré-requisitos

### 1. PostgreSQL Rodando

```bash
# Na raiz do projeto, subir container
docker compose up postgres -d

# Verificar se está saudável
docker ps | grep ufroom_postgres

# Ver logs
docker logs ufroom_postgres
```

### 2. Cliente PostgreSQL (psql)

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Verificar instalação
psql --version
```

### 3. Credenciais de Conexão

**Credenciais padrão** (definidas em `docker-compose.yml`):
```
Host: localhost
Port: 5432
Database: ufroomdb
User: ufroomUser
Password: ufroompassword
```

## 🌱 Feed Universities

### Executar o Script

**Caminho relativo da raiz do projeto:**

```bash
# A partir da raiz do projeto (/home/luis/code/ufroom)
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f apps/db/scripts/feed_universities.sql
```

**Caminho relativo do diretório de scripts:**

```bash
# A partir de apps/db/scripts/
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f feed_universities.sql
```

**Usando variável de ambiente DATABASE_URL:**

```bash
# Se DATABASE_URL está definida no .env
export DATABASE_URL="postgresql://ufroomUser:ufroompassword@localhost:5432/ufroomdb"

# Executar
psql "$DATABASE_URL" -f apps/db/scripts/feed_universities.sql
```

### Output Esperado

```
BEGIN
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
INSERT 0 55
INSERT 0 8
INSERT 0 8
INSERT 0 20
INSERT 0 100
UPDATE 3
UPDATE 3
... (mais UPDATEs)
COMMIT
```

### O Que o Script Faz

1. **Inicia transação** (`BEGIN`)
2. **Limpa tabelas** (ordem reversa de dependências):
   ```sql
   TRUNCATE TABLE annoucement_image CASCADE;
   TRUNCATE TABLE announcement CASCADE;
   TRUNCATE TABLE address CASCADE;
   TRUNCATE TABLE owner CASCADE;
   TRUNCATE TABLE university CASCADE;
   ```
3. **Insere 55 universidades:**
   - UFMG, USP, UNICAMP, UFRJ, UFPE, UFC, UFBA, etc.
   - Estados: MG, SP, RJ, PE, CE, BA, RS, PR, SC

4. **Insere 8 proprietários:**
   - Emails: `owner1@test.com` até `owner8@test.com`
   - Senha para todos: `password123` (hasheada com bcrypt)

5. **Insere 8 endereços com coordenadas reais:**
   ```
   Belo Horizonte: -19.916681, -43.934493
   São Paulo (Paulista): -23.561414, -46.656139
   São Paulo (Consolação): -23.551933, -46.657999
   Rio de Janeiro: -22.920454, -43.174909
   Fortaleza (Meireles): -3.729770, -38.492704
   Fortaleza (Aldeota): -3.736650, -38.508870
   Curitiba: -25.436858, -49.270222
   Porto Alegre: -30.016883, -51.208354
   ```

6. **Insere 20 anúncios:**
   - Títulos variados: "Kitnet Estudantil", "Quarto Compartilhado", etc.
   - Preços: R$ 500 a R$ 1800
   - Vagas: 1 a 4
   - Gêneros: M, F, U (unissex)

7. **Associa anúncios a endereços:**
   - Distribui os 20 anúncios entre os 8 endereços

8. **Insere 100 imagens:**
   - 5 imagens por anúncio
   - URLs do Firebase Storage
   - Primeira imagem marcada como `cover: true`

9. **Faz commit** da transação

### Verificar Dados Inseridos

```bash
# Conectar ao banco
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost

# Contar registros
SELECT 'universidades:', COUNT(*) FROM university;
SELECT 'proprietários:', COUNT(*) FROM owner;
SELECT 'endereços:', COUNT(*) FROM address;
SELECT 'anúncios:', COUNT(*) FROM announcement;
SELECT 'imagens:', COUNT(*) FROM annoucement_image;

# Ver anúncios com endereço
SELECT a.id, a.title, addr.city, addr.state, addr.latitude, addr.longitude
FROM announcement a
JOIN address addr ON a.id_address = addr.id
ORDER BY a.id;

# Sair
\q
```

## 🔧 Outros Scripts

### Criar Script de Backup

```bash
# Backup completo
pg_dump -U ufroomUser -h localhost ufroomdb > backup_$(date +%Y%m%d).sql

# Restaurar
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost < backup_20260219.sql
```

### Script para Resetar Apenas Anúncios

Crie `reset_announcements.sql`:

```sql
BEGIN;
TRUNCATE TABLE annoucement_image CASCADE;
TRUNCATE TABLE announcement CASCADE;
COMMIT;
```

Executar:
```bash
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f reset_announcements.sql
```

### Script para Adicionar Mais Universidades

Crie `add_universities.sql`:

```sql
INSERT INTO university (name, state) VALUES
('Universidade Federal de Alagoas', 'AL'),
('Universidade Federal do Amazonas', 'AM'),
('Universidade Federal do Acre', 'AC');
```

## 📊 Procedimentos Comuns

### 1. Reset Completo do Banco

```bash
# Parar API (se estiver rodando)
cd apps/api_fastify
sudo lsof -ti:3001 | xargs -r sudo kill -9

# Conectar e dropar banco
PGPASSWORD=ufroompassword psql -U ufroomUser -h localhost -c "DROP DATABASE IF EXISTS ufroomdb;"
PGPASSWORD=ufroompassword psql -U ufroomUser -h localhost -c "CREATE DATABASE ufroomdb;"

# Aplicar schema (a partir do init.sql ou Prisma)
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f apps/db/init.sql

# Ou com Prisma
cd apps/api_fastify
npx prisma db push

# Popular com dados
cd ../..
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f apps/db/scripts/feed_universities.sql

# Reindexar Elasticsearch
cd apps/api_fastify
npx tsx scripts/init_elasticsearch_index.ts
```

### 2. Atualizar Apenas Endereços

```bash
# SQL inline para adicionar novos endereços
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost << 'SQL'
INSERT INTO address (street, neighborhood, state, number, city, cep, latitude, longitude, complement) VALUES
('Nova Rua', 'Centro', 'MG', 999, 'Belo Horizonte', '30000-000', -19.920000, -43.940000, 'Teste');
SQL
```

### 3. Ver Schema do Banco

```bash
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -c "\dt"

# Ou mais detalhado
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost << 'SQL'
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
SQL
```

### 4. Export de Dados para JSON

```bash
# Exportar anúncios para JSON
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -t -c \
"SELECT json_agg(a) FROM (SELECT * FROM announcement) a;" > announcements.json
```

### 5. Verificar Integridade Referencial

```bash
# Anúncios sem endereço
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -c \
"SELECT COUNT(*) AS sem_endereco FROM announcement WHERE id_address IS NULL;"

# Anúncios sem imagens
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -c \
"SELECT a.id, a.title FROM announcement a 
LEFT JOIN annoucement_image img ON a.id = img.id_announcement 
WHERE img.id IS NULL;"
```

## 🐛 Troubleshooting

### Erro: `FATAL: password authentication failed`

**Solução:**
```bash
# Verificar senha no docker-compose.yml
grep POSTGRES_PASSWORD docker-compose.yml

# Usar PGPASSWORD correto
PGPASSWORD=senha_correta psql -U ufroomUser -d ufroomdb -h localhost
```

### Erro: `connection refused`

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Se não, subir
docker compose up postgres -d

# Aguardar 5-10 segundos
sleep 10
```

### Erro: `database "ufroomdb" does not exist`

**Solução:**
```bash
# Criar banco
PGPASSWORD=ufroompassword psql -U ufroomUser -h localhost -c "CREATE DATABASE ufroomdb;"

# Aplicar schema inicial
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f apps/db/init.sql
```

### Script trava ou não responde

**Solução:**
```bash
# Conectar e verificar locks
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost

# Ver processos ativos
SELECT pid, query FROM pg_stat_activity WHERE datname = 'ufroomdb';

# Matar processo travado
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = 12345;

# Sair
\q
```

### Dados duplicados após múltiplas execuções

**Problema:** `feed_universities.sql` usa `TRUNCATE`, mas pode falhar

**Solução:**
```bash
# O script já tem TRUNCATE CASCADE, mas se falhar:
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost << 'SQL'
BEGIN;
DELETE FROM annoucement_image;
DELETE FROM announcement;
DELETE FROM address;
DELETE FROM owner;
DELETE FROM university;
COMMIT;
SQL

# Depois executar feed novamente
```

## 📚 Recursos

- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [psql Command Reference](https://www.postgresql.org/docs/current/app-psql.html)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres)
