# Frontend Web - UFRoom 🌐

Interface web do UFRoom construída com Next.js 15, React 19 e Tailwind CSS 4. Permite busca, visualização e cadastro de anúncios de repúblicas e kitnets.

## 📋 Sumário

- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Firebase Storage](#-firebase-storage)
- [Google Maps API](#-google-maps-api)
- [Executar](#-executar)
- [Estrutura](#-estrutura)
- [Páginas](#-páginas)
- [Componentes](#-componentes)
- [Troubleshooting](#-troubleshooting)

## 🛠 Tecnologias

- **Next.js 15.5.0** - Framework React com SSR e App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework de estilização utility-first
- **Firebase SDK** - Upload e armazenamento de imagens
- **Google Maps API** - Mapas, geocoding e autocomplete de locais
- **DnD Kit** - Drag & drop para ordenação de imagens
- **Axios** - Cliente HTTP para comunicação com API
- **Turbopack** - Bundler de alta performance

## 📦 Instalação

### Pré-requisitos

- Node.js 20+ e npm
- API Fastify rodando em `http://localhost:3001`
- Conta Firebase com Storage configurado
- Google Cloud Platform com APIs habilitadas

### 1. Instalar Dependências

```bash
cd apps/web
npm install
```

## ⚙️ Configuração

### 1. Criar Arquivo `.env`

```bash
cp example.env .env
```

### 2. Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui

# Firebase Client Configuration (safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-bucket.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

**⚠️ Importante:** Todas as variáveis precisam do prefixo `NEXT_PUBLIC_` para serem acessíveis no browser.

## 🔥 Firebase Storage

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Add project" / "Adicionar projeto"
3. Dê um nome (ex: `ufroom-projeto`)
4. Desabilite Google Analytics (opcional)
5. Crie o projeto

### 2. Configurar Storage

1. No menu lateral: **Build** → **Storage**
2. Clique em "Get started"
3. Escolha modo **Production** (regras de segurança podem ser ajustadas depois)
4. Escolha localização: `southamerica-east1` (São Paulo)
5. Clique em "Done"

### 3. Configurar Regras de Segurança

No Firebase Console → Storage → Rules, configure:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura pública de imagens
    match /announcements/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;  // Ou true para desenvolvimento
    }
  }
}
```

### 4. Habilitar Billing

⚠️ **Firebase Storage requer billing ativo**, mesmo no plano gratuito:

1. Firebase Console → **Project Overview** (ícone engrenagem) → **Usage and billing**
2. Clique em "**Modify plan**"
3. Selecione "**Blaze (Pay as you go)**"
4. Vincule um cartão de crédito (não será cobrado no limite gratuito)

**Limites gratuitos:**
- 5 GB armazenamento
- 1 GB download/dia
- 20.000 operações/dia

### 5. Obter Credenciais

1. Firebase Console → **Project Overview** (ícone engrenagem) → **Project settings**
2. Role até "**Your apps**"
3. Clique no ícone **Web** (`</>`)
4. Registre um app (ex: "UFRoom Web")
5. Copie o objeto `firebaseConfig` para o `.env`:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "projeto.firebaseapp.com",  // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "projeto-id",        // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "bucket.firebasestorage.app",  // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",    // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"          // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## 🗺 Google Maps API

### 1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Anote o **Project ID**

### 2. Habilitar APIs Necessárias

No menu lateral: **APIs & Services** → **Library**

Habilite as seguintes APIs:
- ✅ **Maps JavaScript API** (para renderizar mapas)
- ✅ **Geocoding API** (converter endereços em coordenadas)
- ✅ **Places API** (autocomplete de locais)

### 3. Criar API Key

1. **APIs & Services** → **Credentials**
2. Clique em "**Create Credentials**" → "**API Key**"
3. Copie a chave gerada
4. Clique em "**Restrict Key**" (recomendado):
   - **Application restrictions:** HTTP referrers
   - Add: `http://localhost:3000/*` e `http://localhost:3001/*`
   - **API restrictions:** Restrict key
   - Selecione: Maps JavaScript API, Geocoding API, Places API

### 4. Habilitar Billing

⚠️ **Google Maps API requer billing ativo:**

1. Menu lateral: **Billing** → **Link a billing account**
2. Crie uma conta de faturamento ou vincule existente
3. Adicione método de pagamento

**Créditos gratuitos:**
- $200/mês de crédito gratuito
- Suficiente para ~28.000 carregamentos de mapa/mês

### 5. Adicionar ao `.env`

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

## 🚀 Executar

### Modo Desenvolvimento

```bash
npm run dev
```

- Servidor dev com **Turbopack** (fast refresh)
- Hot reload automático
- Aplicação em: `http://localhost:3000`

### Modo Produção

```bash
# Build otimizado
npm run build

# Executar versão de produção
npm start
```

### Verificar Build

```bash
# Analisar bundle size
npm run build

# Lint
npm run lint
```

## 📁 Estrutura

```
apps/web/
├── src/
│   ├── app/                          # App Router (Next.js 15)
│   │   ├── layout.tsx               # Layout raiz
│   │   ├── page.tsx                 # Homepage (/)
│   │   │
│   │   ├── homepage/                # Página inicial alternativa
│   │   │   └── page.tsx
│   │   │
│   │   ├── login/                   # Login
│   │   │   └── page.tsx             # /login
│   │   │
│   │   ├── register/                # Registro
│   │   │   └── page.tsx             # /register
│   │   │
│   │   ├── search/                  # Busca de anúncios
│   │   │   └── page.tsx             # /search
│   │   │
│   │   ├── announcement/            # Detalhes de anúncio
│   │   │   └── [id]/
│   │   │       └── page.tsx         # /announcement/:id
│   │   │
│   │   ├── register-announcement/   # Cadastro de anúncio
│   │   │   └── page.tsx             # /register-announcement
│   │   │
│   │   ├── faq/                     # FAQ
│   │   │   └── page.tsx             # /faq
│   │   │
│   │   └── globals.css              # Estilos globais + Tailwind
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── Header.tsx               # Cabeçalho com navegação
│   │   ├── SearchBar.tsx            # Barra de busca simples
│   │   └── SearchAutocomplete.tsx   # Busca com Google Places
│   │
│   └── global-contexts/              # Context API
│       └── authcontext.tsx          # Gerenciamento de autenticação
│
├── public/                           # Assets estáticos
│
├── .env                             # Variáveis de ambiente (não commitar!)
├── example.env                      # Template
├── next.config.ts                   # Configuração Next.js
├── tailwind.config.ts               # Configuração Tailwind
├── tsconfig.json                    # TypeScript config
└── README.md
```

## 📄 Páginas

### `/` - Homepage
- Landing page inicial
- Links para busca, login e registro

### `/search` - Busca de Anúncios
- Filtros: palavra-chave, localização, preço, gênero, vagas
- Google Maps para seleção de localização
- Resultados com paginação
- Cards de anúncios com imagem cover

### `/announcement/[id]` - Detalhes do Anúncio
- Galeria de imagens
- Informações completas (endereço, preço, vagas, descrição)
- Mapa com localização
- Dados de contato do proprietário

### `/register-announcement` - Cadastrar Anúncio
- **Requer autenticação** (JWT)
- Upload de múltiplas imagens (Firebase Storage)
- Drag & drop para ordenar imagens
- Seleção de imagem cover (destaque)
- Formulário completo com validação
- Integração com Google Maps para endereço

### `/login` - Login
- Autenticação via email/senha
- JWT armazenado em Context API
- Redirecionamento após login

### `/register` - Registro
- Cadastro de novo proprietário
- Validação de email único
- Hash de senha no backend

### `/faq` - Perguntas Frequentes
- Informações sobre uso da plataforma

## 🧩 Componentes

### `Header.tsx`
- Navegação principal
- Exibe nome do usuário logado
- Links condicionais (autenticado/não autenticado)

### `SearchBar.tsx`
- Barra de busca simples por palavra-chave
- Submit redireciona para `/search`

### `SearchAutocomplete.tsx`
- Busca com autocomplete do Google Places API
- Retorna coordenadas geográficas
- Usado na página de busca

### Context: `authcontext.tsx`
- Gerencia estado de autenticação global
- Armazena: `token`, `owner` (dados do proprietário)
- Funções: `login()`, `logout()`
- Persiste em localStorage (opcional: implementar)

## 🐛 Troubleshooting

### Imagens não carregam (Firebase)

**Erro:** `403 Forbidden` ao acessar imagens

**Solução:**
1. Verificar se billing está ativo no Firebase
2. Conferir regras de segurança do Storage (permitir `read: true`)
3. Verificar URL do bucket no `.env` (deve terminar com `.firebasestorage.app`)

```bash
# Testar URL de imagem diretamente:
curl -I https://firebasestorage.googleapis.com/v0/b/seu-bucket.firebasestorage.app/o/announcements%2Ftest.jpg?alt=media
```

### Google Maps não carrega

**Erro:** `Google Maps API error: ApiNotActivatedMapError`

**Solução:**
1. Habilitar billing no Google Cloud
2. Ativar APIs: Maps JavaScript API, Geocoding API, Places API
3. Aguardar alguns minutos para propagação

**Erro:** `RefererNotAllowedMapError`

**Solução:**
- Configurar restrição de API Key para aceitar `http://localhost:3000/*`

### Next.js build error

**Erro:** `Module not found: Can't resolve '../../../serviceAccountKey.json'`

**Solução:**
- Remover imports de `serviceAccountKey.json` (chave de service account não deve ir para browser)
- Usar configuração client-side do Firebase (variáveis `NEXT_PUBLIC_*`)

### API não responde

**Erro:** `Network Error` ou `ERR_CONNECTION_REFUSED`

**Solução:**
```bash
# Verificar se API está rodando
curl http://localhost:3001/health

# Se não, inicie a API:
cd apps/api_fastify
npm start
```

### Autenticação falha

**Erro:** Token JWT inválido

**Solução:**
1. Fazer logout e login novamente
2. Verificar se `JWT_SECRET` na API não mudou
3. Limpar localStorage: `localStorage.clear()`

### Estilos não aplicados

**Erro:** Classes Tailwind não funcionam

**Solução:**
```bash
# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências
npm install

# Dev server
npm run dev
```

## 🔐 Segurança

- ✅ **NUNCA** commite o arquivo `.env`
- ✅ **NUNCA** use `serviceAccountKey.json` no frontend (apenas backend)
- ✅ Use variáveis `NEXT_PUBLIC_*` apenas para dados seguros para browser
- ✅ Valide entrada do usuário no backend (não confie no frontend)
- ✅ Em produção: configure CORS, HTTPS, rate limiting

## 🎨 Customização

### Cores e Tema

Edite [tailwind.config.ts](tailwind.config.ts):

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Estilos Globais

Edite [src/app/globals.css](src/app/globals.css):

```css
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```