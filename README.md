# UFRoom 🏠

Plataforma de anúncios de aluguel focada em estudantes universitários, facilitando a busca por repúblicas e kitnets próximas às universidades.

## 📋 Sumário

- [Objetivos e Features](#-objetivos-e-features)
- [Pilha de Tecnologias](#-pilha-de-tecnologias)
- [Arquitetura](#-arquitetura)
- [Começando](#-começando)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Membros da Equipe](#-membros-da-equipe)

## 🎯 Objetivos e Features

### Para Anunciantes
- ✅ Cadastro e autenticação segura com JWT
- ✅ Cadastro de imóveis com múltiplas imagens (drag & drop)
- ✅ Upload de imagens via Firebase Storage
- ✅ Edição e remoção de anúncios
- ✅ Gerenciamento de informações de contato

### Para Estudantes
- ✅ Busca geolocalizada (raio de 50km)
- ✅ Filtros por universidade, localização, especificações
- ✅ Pesquisa por palavra-chave com Elasticsearch
- ✅ Visualização de catálogo com imagens
- ✅ Acesso a informações detalhadas dos imóveis
- ✅ Contato direto com anunciantes

## 🛠 Pilha de Tecnologias

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastify/fastify-original.svg" alt="Fastify" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width="40" height="40"/>
</p>

### Frontend
- **Next.js 15.5.0** - Framework React com SSR e App Router
- **React 19** - Biblioteca UI
- **Tailwind CSS 4** - Estilização
- **Firebase SDK** - Upload e gerenciamento de imagens
- **Google Maps API** - Geolocalização e mapas
- **DnD Kit** - Drag & drop de imagens

### Backend API (Node.js)
- **Fastify 5.5.0** - Framework web de alta performance
- **Prisma ORM** - Acesso ao banco de dados
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP

### Backend AI Agent (Python)
- **FastAPI** - Framework web assíncrono
- **LangGraph** - Orquestração de agentes AI
- **Google Gemini AI** - Modelo de linguagem
- **LangChain** - Framework para LLMs

### Infraestrutura
- **PostgreSQL 16** - Banco de dados relacional
- **Elasticsearch 9.3.0** - Busca full-text e geolocalização
- **Docker & Docker Compose** - Containerização
- **Firebase Storage** - Armazenamento de imagens

## 🏗 Arquitetura

```
┌─────────────────┐
│   Next.js Web   │ ──→ Firebase Storage (Imagens)
│   (Port 3000)   │ ──→ Google Maps API
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐
│  Fastify API    │ ──→ PostgreSQL (Port 5432)
│   (Port 3001)   │ ──→ Elasticsearch (Port 9200)
└─────────────────┘

┌─────────────────┐
│  FastAPI Agent  │ ──→ Google Gemini AI
│   (Port 8000)   │
└─────────────────┘
```

## 🚀 Começando

### Pré-requisitos

- **Node.js 20+** e npm
- **Docker** e Docker Compose
- **Python 3.12+** (opcional, para AI agent)
- **Contas**: Google Cloud (Maps + Gemini), Firebase

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd ufroom
```

### 2. Configuração do Banco de Dados PostgreSQL

```bash
# Subir container PostgreSQL
docker compose up postgres -d

# Aguardar inicialização (5-10 segundos)
docker logs ufroom_postgres

# Verificar saúde
docker ps | grep ufroom_postgres
```

**Credenciais padrão:**
- Host: `localhost:5432`
- Database: `ufroomdb`
- User: `ufroomUser`
- Password: `ufroompassword`

### 3. Configuração do Elasticsearch

```bash
# Subir Elasticsearch local
cd apps/db
sudo curl -fsSL https://elastic.co/start-local | sudo sh

# Anote as credenciais retornadas:
# - Username: elastic
# - Password: (senha gerada aleatoriamente)
# - URL: http://localhost:9200
```

### 4. Popular Banco de Dados

```bash
# Conectar ao PostgreSQL e executar script de seed
PGPASSWORD=ufroompassword psql -U ufroomUser -d ufroomdb -h localhost -f apps/db/scripts/feed_universities.sql

# Isso criará:
# - 55 universidades brasileiras
# - 8 proprietários
# - 20 anúncios de exemplo
# - 100 imagens
# - 8 endereços em cidades brasileiras
```

### 5. Configurar Variáveis de Ambiente

**API Fastify** (`apps/api_fastify/.env`):
```env
DATABASE_URL="postgresql://ufroomUser:ufroompassword@localhost:5432/ufroomdb"
ELASTICSEARCH_URL="http://localhost:9200"
ELASTICSEARCH_USERNAME="elastic"
ELASTICSEARCH_PASSWORD="sua_senha_do_passo_3"
JWT_SECRET="seu_secret_jwt_aqui"
GOOGLE_MAPS_API_KEY="sua_chave_google_maps"
```

**Frontend Web** (`apps/web/.env`):
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua_chave_google_maps"
NEXT_PUBLIC_FIREBASE_API_KEY="sua_chave_firebase"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-bucket.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="seu-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="seu-app-id"
```

**API FastAPI** (`apps/api_fastapi/.env`) - Opcional:
```env
GOOGLE_API_KEY="sua_chave_gemini_ai"
```

### 6. Instalar Dependências e Iniciar Serviços

**API Fastify:**
```bash
cd apps/api_fastify
npm install
npx prisma generate

# Indexar dados no Elasticsearch
npx tsx scripts/init_elasticsearch_index.ts

# Iniciar servidor
npm start
# API rodando em http://localhost:3001
```

**Frontend Web:**
```bash
cd apps/web
npm install
npm run dev
# Aplicação rodando em http://localhost:3000
```

**API FastAPI** (Opcional):
```bash
cd apps/api_fastapi

# Instalar uv (gerenciador Python)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Criar ambiente virtual e instalar dependências
uv venv --python 3.12
uv pip install -r requirements.txt

# Iniciar servidor
uv run uvicorn main:app --reload
# API rodando em http://localhost:8000
```

### 7. Verificar Instalação

```bash
# Testar API
curl http://localhost:3001/health
# Resposta: {"status":"ok"}

# Testar Elasticsearch
curl -u elastic:sua_senha http://localhost:9200/announcements/_count
# Resposta: {"count":20,...}

# Acessar aplicação
# Navegador: http://localhost:3000
```

## 📁 Estrutura do Projeto

```
ufroom/
├── apps/
│   ├── api_fastify/         # API Node.js principal
│   │   ├── src/
│   │   │   ├── controllers/ # Lógica de controle
│   │   │   ├── services/    # Lógica de negócio
│   │   │   ├── routes/      # Definição de rotas
│   │   │   ├── schemas/     # Validação Zod
│   │   │   └── plugins/     # Plugins Fastify
│   │   ├── prisma/          # Schema do banco
│   │   └── scripts/         # Scripts utilitários
│   │
│   ├── api_fastapi/         # AI Agent Python
│   │   ├── simple_agent/    # Implementação do agente
│   │   └── requirements.txt
│   │
│   ├── web/                 # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/         # App Router (páginas)
│   │   │   ├── components/  # Componentes React
│   │   │   └── global-contexts/ # Context API
│   │   └── public/          # Assets estáticos
│   │
│   └── db/                  # Banco de dados
│       ├── Dockerfile       # PostgreSQL 16
│       ├── init.sql         # Schema inicial
│       └── scripts/         # Scripts de seed
│
├── docker-compose.yml       # Orquestração containers
└── README.md               # Este arquivo
```

## 👥 Membros da Equipe

*   **Gustavo Paiva** - Backend, Product Owner
*   **Luis Sousa** - Backend, Arquiteto de Banco de Dados
*   **Luiz Costa** - Frontend, Designer
*   **Marcus Oliveira** - Fullstack, Scrum Master


