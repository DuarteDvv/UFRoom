# API Fastify - UFRoom 🚀

API REST principal do UFRoom, construída com Fastify para alta performance. Gerencia autenticação, anúncios, busca geolocalizada e integração com Elasticsearch.

## 📋 Sumário

- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Banco de Dados](#-banco-de-dados)
- [Elasticsearch](#-elasticsearch)
- [Executar](#-executar)
- [Estrutura](#-estrutura)
- [Endpoints](#-endpoints)
- [Scripts Úteis](#-scripts-úteis)

## 🛠 Tecnologias

- **Fastify 5.5.0** - Framework web de alta performance
- **Prisma ORM** - Type-safe database client
- **TypeScript** - Tipagem estática
- **JWT** - Autenticação via tokens
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Elasticsearch** - Busca full-text e geolocalização
- **Axios** - Cliente HTTP
- **CORS** - Suporte para requisições cross-origin
- **Rate Limit** - Proteção contra abuso (100 req/min)

## 📦 Instalação

### Pré-requisitos

- Node.js 20+ e npm
- PostgreSQL rodando (via Docker recomendado)
- Elasticsearch 9.3.0+

### 1. Instalar Dependências

```bash
cd apps/api_fastify
npm install
```

## ⚙️ Configuração

### 1. Criar Arquivo `.env`

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp example.env .env
```

### 2. Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Banco de Dados PostgreSQL
DATABASE_URL="postgresql://ufroomUser:ufroompassword@localhost:5432/ufroomdb"

# Elasticsearch
ELASTICSEARCH_URL="http://localhost:9200"
ELASTICSEARCH_USERNAME="elastic"
ELASTICSEARCH_PASSWORD="sua_senha_aqui"

# JWT Authentication
JWT_SECRET="seu_secret_super_secreto_aqui_min_32_chars"

# Google Maps API
GOOGLE_MAPS_API_KEY="sua_chave_google_maps_api"

# Servidor
PORT=3001
```

### 3. Obter Credenciais Necessárias

**Elasticsearch:**
```bash
# Se ainda não iniciou o Elasticsearch:
cd ../db
sudo curl -fsSL https://elastic.co/start-local | sudo sh
# Anote o password retornado
```

**Google Maps API:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Ative as APIs: Maps JavaScript API, Geocoding API, Places API
4. Crie credenciais (API Key)
5. **Importante:** Configure billing no projeto

## 🗄 Banco de Dados

### 1. Garantir PostgreSQL Rodando

```bash
# Na raiz do projeto
docker compose up postgres -d

# Verificar status
docker logs ufroom_postgres
```

### 2. Gerar Cliente Prisma

```bash
npx prisma generate
```

### 3. Popular Banco com Dados de Teste

```bash
# Voltar para raiz do projeto
cd ../..

# Executar script de seed
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f apps/db/scripts/feed_universities.sql
```

**O script cria:**
- ✅ 55 universidades brasileiras
- ✅ 8 proprietários (owners)
- ✅ 20 anúncios de exemplo
- ✅ 100 imagens vinculadas
- ✅ 8 endereços em cidades (BH, SP, RJ, Fortaleza, Curitiba, Porto Alegre)

### 4. Comandos Prisma Úteis

```bash
# Visualizar banco no navegador
npx prisma studio

# Sincronizar schema com banco
npx prisma db pull

# Aplicar migrações (se houver)
npx prisma migrate dev

# Resetar banco (CUIDADO!)
npx prisma migrate reset
```

## 🔍 Elasticsearch

### 1. Criar Índice e Indexar Dados

```bash
# Certifique-se de que a API está rodando ou inicie temporariamente
npm start &

# Em outro terminal, execute o script de indexação
npx tsx scripts/init_elasticsearch_index.ts
```

**O script faz:**
1. ⚠️ Deleta índice `announcements` existente
2. ✅ Cria novo índice com mapping de `geo_point`  
3. 📡 Busca anúncios da API (`/announcements`)
4. 📦 Indexa com coordenadas geográficas
5. ✅ Confirma indexação (ex: "20 documentos disponíveis")

### 2. Verificar Indexação

```bash
# Contar documentos
curl -u elastic:sua_senha "http://localhost:9200/announcements/_count"

# Ver documentos de exemplo
curl -u elastic:sua_senha "http://localhost:9200/announcements/_search?size=3"
```

### 3. Estrutura do Índice

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "integer" },
      "title": { "type": "text" },
      "description": { "type": "text" },
      "price": { "type": "float" },
      "available_vacancies": { "type": "integer" },
      "gender": { "type": "keyword" },
      "location": { "type": "geo_point" },  // Para busca geolocalizada
      "address": { "type": "text" },
      "state": { "type": "keyword" },
      "city": { "type": "keyword" }
    }
  }
}
```

## 🚀 Executar

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

**Servidor disponível em:** `http://localhost:3001`

### Verificar Saúde

```bash
curl http://localhost:3001/health
# Resposta: {"status":"ok"}
```

## 📁 Estrutura

```
apps/api_fastify/
├── src/
│   ├── server.ts              # Configuração inicial do Fastify
│   │
│   ├── controllers/           # Lógica de controle HTTP
│   │   ├── auth.ts           # Login, registro, JWT
│   │   ├── announcement.ts   # CRUD anúncios
│   │   ├── search.ts         # Busca Elasticsearch + geolocalização
│   │   ├── owner.ts          # Gestão de proprietários
│   │   ├── university.ts     # Listagem universidades
│   │   ├── autocomplete.ts   # Sugestões de busca
│   │   └── address.ts        # Gestão de endereços
│   │
│   ├── services/              # Lógica de negócio
│   │   ├── auth.ts           # Hash, validação, tokens
│   │   ├── announcement.ts   # Regras de anúncios
│   │   ├── search.ts         # Queries Elasticsearch
│   │   └── ...
│   │
│   ├── routes/                # Definição de rotas
│   │   ├── auth.ts           # POST /login, /register
│   │   ├── announcement.ts   # GET/POST/PUT/DELETE /announcements
│   │   ├── search.ts         # GET /search
│   │   └── ...
│   │
│   ├── schemas/               # Validação Zod
│   │   ├── auth.ts           # Schema login/registro
│   │   ├── announcement.ts   # Schema CRUD anúncios
│   │   └── ...
│   │
│   └── plugins/               # Plugins Fastify
│       ├── prisma.ts         # Injeção Prisma Client
│       ├── elasticsearch.ts  # Cliente Elasticsearch
│       └── jwt.ts            # Autenticação JWT
│
├── prisma/
│   └── schema.prisma         # Modelo do banco de dados
│
├── scripts/
│   └── init_elasticsearch_index.ts  # Indexação inicial
│
├── .env                      # Variáveis de ambiente (não commitar!)
├── example.env               # Template de variáveis
├── package.json
└── README.md
```

## 🌐 Endpoints

### Autenticação

```bash
# Registrar novo proprietário
POST /register
Body: { "email": "...", "password": "...", "name": "...", "phone": "..." }

# Login
POST /login
Body: { "email": "...", "password": "..." }
Response: { "token": "eyJ...", "owner": {...} }
```

### Anúncios

```bash
# Listar todos anúncios
GET /announcements

# Buscar por ID
GET /announcements/:id

# Criar anúncio (requer autenticação)
POST /announcements
Headers: { "Authorization": "Bearer TOKEN" }
Body: { "title": "...", "description": "...", "price": 800, ... }

# Atualizar anúncio
PUT /announcements/:id
Headers: { "Authorization": "Bearer TOKEN" }

# Deletar anúncio
DELETE /announcements/:id
Headers: { "Authorization": "Bearer TOKEN" }
```

### Busca Geolocalizada

```bash
# Buscar anúncios por palavra-chave
GET /search?query=kitnet

# Buscar por localização (raio 50km)
GET /search?lat=-19.916681&lon=-43.934493

# Buscar combinando filtros
GET /search?query=quarto&lat=-23.561414&lon=-46.656139&gender=F&maxPrice=1000

# Autocomplete
GET /autocomplete?query=belo
```

### Outros

```bash
# Listar universidades
GET /universities

# Health check
GET /health

# Listar endereços
GET /addresses
```

## 🔧 Scripts Úteis

### Reindexar Elasticsearch

```bash
# Deletar índice antigo e criar novo com dados atualizados
npx tsx scripts/init_elasticsearch_index.ts
```

### Verificar Tipos TypeScript

```bash
npm run type-check  # ou tsc --noEmit
```

### Limpar e Reinstalar

```bash
rm -rf node_modules package-lock.json
npm install
```

### Logs de Erros

```bash
# Se a API não iniciar, verifique:
npm start 2>&1 | tee api-error.log
```

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ JWT com expiração configurável
- ✅ CORS configurado para `http://localhost:3000`
- ✅ Rate limiting: 100 requisições/minuto
- ✅ Validação de entrada com Zod
- ⚠️ Em produção: use HTTPS, variáveis de ambiente seguras, rate limit mais restritivo

## 🐛 Troubleshooting

**Erro de autenticação Elasticsearch:**
```bash
# Verifique se as credenciais estão corretas no .env
curl -u elastic:sua_senha http://localhost:9200/_cluster/health
```

**Prisma não encontra tabelas:**
```bash
npx prisma generate
npx prisma db pull
```

**Porta 3001 já em uso:**
```bash
# Matar processo
sudo lsof -ti:3001 | xargs -r sudo kill -9

# Ou mudar porta no .env
PORT=3002
```

**Busca por localização retorna vazio:**
```bash
# Verificar se anúncios têm coordenadas no Elasticsearch
curl -u elastic:senha "localhost:9200/announcements/_search?size=1"
# Cheque se "location": {"lat": ..., "lon": ...} não é 0,0

# Reindexar se necessário
npx tsx scripts/init_elasticsearch_index.ts
``` 
