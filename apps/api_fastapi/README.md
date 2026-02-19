# API FastAPI - UFRoom AI Agent 🤖

Agente conversacional inteligente construído com FastAPI, LangGraph e Google Gemini AI. Ajuda estudantes a encontrar acomodações através de conversação natural.

## 📋 Sumário

- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executar](#-executar)
- [Estrutura](#-estrutura)
- [Como Funciona](#-como-funciona)
- [Endpoints](#-endpoints)
- [Troubleshooting](#-troubleshooting)

## 🛠 Tecnologias

- **FastAPI** - Framework web assíncrono de alta performance
- **LangGraph** - Framework para orquestração de agentes com estados
- **LangChain** - Toolkit para integração com LLMs
- **Google Gemini AI** - Modelo de linguagem (gemini-1.5-flash)
- **Pydantic** - Validação de dados e schemas
- **Python 3.12+** - Linguagem de programação
- **UV** - Gerenciador de pacotes e ambientes virtuais ultrarrápido

## 📦 Instalação

### Pré-requisitos

- Python 3.12 ou superior
- Google Cloud account com Gemini API habilitada
- UV package manager (recomendado) ou pip

### 1. Instalar UV (Gerenciador Python)

UV é um gerenciador de pacotes Python extremamente rápido, substituto do pip/poetry/conda.

```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Recarregar shell
source ~/.bashrc  # ou ~/.zshrc
```

### 2. Navegar para o Diretório

```bash
cd apps/api_fastapi
```

### 3. Criar Ambiente Virtual

```bash
# Criar ambiente virtual com Python 3.12
uv venv --python 3.12

# Ativar ambiente virtual
source .venv/bin/activate  # Linux/macOS
# ou
.venv\Scripts\activate     # Windows
```

### 4. Instalar Dependências

```bash
# Instalar a partir do requirements.txt
uv pip install -r requirements.txt
```

**Dependências instaladas:**
```txt
fastapi==0.115.6          # Framework web
uvicorn[standard]==0.34.0 # ASGI server
pydantic==2.10.4          # Validação de dados
python-dotenv==1.0.1      # Variáveis de ambiente
langgraph==0.2.59         # Orquestração de agentes
langchain-google-genai==2.0.8  # Integração Gemini
```

## ⚙️ Configuração

### 1. Criar Arquivo `.env`

```bash
cp example.env .env
```

### 2. Obter Google Gemini API Key

1. Acesse [Google AI Studio](https://aistudio.google.com/apikey)
2. Faça login com conta Google
3. Clique em "**Get API key**" ou "**Create API key**"
4. Selecione um projeto Google Cloud ou crie novo
5. Copie a chave gerada

**⚠️ Importante:** Gemini AI tem limites gratuitos:
- **Free tier:** 15 requisições/minuto, 1.5M tokens/dia
- **API Key gratuita:** Não requer billing inicial

### 3. Configurar `.env`

Edite o arquivo `.env`:

```env
GOOGLE_API_KEY=AIzaSy...sua_chave_gemini_aqui
```

## 🚀 Executar

### Modo Desenvolvimento

```bash
# Com UV (recomendado)
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ou com Python diretamente
python -m uvicorn main:app --reload
```

**Servidor disponível em:** `http://localhost:8000`

### Modo Produção

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Verificar Instalação

```bash
# Health check
curl http://localhost:8000/

# Documentação interativa
# Navegador: http://localhost:8000/docs
```

## 📁 Estrutura

```
apps/api_fastapi/
├── simple_agent/              # Implementação do agente
│   ├── agent.py              # Definição do grafo LangGraph
│   │                         # - Nós: search_node, respond_node
│   │                         # - Fluxo condicional de estados
│   │
│   └── utils/                # Utilitários do agente
│       ├── context.py        # Context loader (dados externos)
│       ├── prompt.py         # Prompts do sistema e usuário
│       ├── request_schema.py # Schema Pydantic para requests
│       └── state.py          # Definição de estado do agente
│
├── main.py                   # Entry point FastAPI
│                            # - Endpoint POST /chat
│                            # - Configuração CORS
│                            # - Invocação do agente
│
├── requirements.txt          # Dependências Python
├── example.env               # Template de variáveis
├── .env                     # Credenciais (não commitar!)
└── README.md                # Este arquivo
```

## 🤖 Como Funciona

### Arquitetura do Agente

O agente usa **LangGraph** para implementar um fluxo conversacional com estados:

```
┌─────────────┐
│   Usuário   │
│ "Busco um   │
│ quarto em   │
│ Belo        │
│ Horizonte"  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│          START (Estado Inicial)      │
│  - messages: histórico               │
│  - context: dados da base            │
└──────────────┬──────────────────────┘
               │
               ↓
       ┌───────────────┐
       │ search_node   │──→ Decide se busca na base
       │ (Condicional) │    ou responde diretamente
       └───────┬───────┘
               │
        ┌──────┴──────┐
        │             │
        ↓             ↓
   ╔════════╗    ╔═══════════╗
   ║ SEARCH ║    ║  RESPOND  ║
   ╚════╤═══╝    ╚═══╤═══════╝
        │            │
        ↓            ↓
  [Busca dados] [Gera resposta]
  [Atualiza     [Com contexto]
   contexto]    [ou busca]
        │            │
        └────┬───────┘
             │
             ↓
       ┌─────────────┐
       │respond_node │──→ Gemini 1.5 Flash
       │ (LLM Call)  │    gera resposta natural
       └──────┬──────┘
              │
              ↓
         ╔════════╗
         ║  END   ║
         ╚════════╝
              │
              ↓
    { "response": "Encontrei 3 opções..." }
```

### Fluxo de Processamento

1. **Recebe mensagem** do usuário via POST `/chat`
2. **Inicializa estado** com histórico de mensagens
3. **search_node:** Gemini decide se precisa buscar dados ou responder
4. **Roteamento condicional:**
   - Se "SEARCH" → carrega dados da base (simulado)
   - Se "RESPOND" → pula para geração de resposta
5. **respond_node:** Gemini gera resposta natural usando contexto
6. **Retorna JSON** com resposta do agente

### Principais Componentes

**`simple_agent/agent.py`:**
```python
# Define o grafo LangGraph
workflow = StateGraph(AgentState)
workflow.add_node("search", search_node)
workflow.add_node("respond", respond_node)

# Fluxo condicional
workflow.add_conditional_edges(
    "search",
    route_after_search,  # Decide próximo passo
    {"search": "search", "respond": "respond"}
)
```

**`simple_agent/utils/state.py`:**
```python
class AgentState(TypedDict):
    messages: List[BaseMessage]  # Histórico conversa
    context: str                 # Dados externos
```

**`simple_agent/utils/prompt.py`:**
- Define personalidade do agente
- Instruções de formatação
- Template de resposta

## 🌐 Endpoints

### `POST /chat`

Envia mensagem para o agente e recebe resposta.

**Request:**
```json
{
  "message": "Busco um quarto masculino em Belo Horizonte por até 800 reais"
}
```

**Response:**
```json
{
  "response": "Encontrei algumas opções para você em Belo Horizonte:\n\n1. Quarto Estudante - R$ 750/mês\n   Localização: Rua dos Estudantes, 123 - Centro\n   Próximo à UFMG\n   Contato: (31) 98765-4321\n\n2. Kitnet Estudantil - R$ 800/mês\n   Mais próximo à universidade...",
  "context_used": "sim",
  "model": "gemini-1.5-flash"
}
```

### `GET /`

Health check e documentação.

**Response:**
```json
{
  "message": "UFRoom AI Agent",
  "status": "online",
  "docs": "/docs"
}
```

### `GET /docs`

Documentação interativa Swagger UI (acesse pelo navegador).

## 🔧 Desenvolvimento

### Testar API

```bash
# Com curl
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Preciso de um quarto em Belo Horizonte"}'

# Com Python requests
python -c "
import requests
response = requests.post('http://localhost:8000/chat', 
    json={'message': 'Busco apartamento para estudantes'})
print(response.json())
"
```

### Logs e Debug

```bash
# Ver logs detalhados do agente
uv run uvicorn main:app --reload --log-level debug

# Logs aparecem no terminal com:
# - Estado do grafo
# - Decisões tomadas
# - Contexto usado
# - Resposta gerada
```

### Modificar Comportamento

**Ajustar prompt do agente:**
Edite `simple_agent/utils/prompt.py`:
```python
SYSTEM_PROMPT = """
Você é um assistente especializado em...
[Customize aqui]
"""
```

**Adicionar dados de contexto:**
Edite `simple_agent/utils/context.py`:
```python
def load_context():
    # Conectar com API ou banco
    # Buscar anúncios reais
    return formatted_data
```

**Mudar modelo Gemini:**
Edite `simple_agent/agent.py`:
```python
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",  # Ou gemini-2.0-flash-exp
    temperature=0.7
)
```

## 🐛 Troubleshooting

### Erro: `GOOGLE_API_KEY not found`

**Solução:**
```bash
# Verificar se .env existe e contém a chave
cat .env | grep GOOGLE_API_KEY

# Se não, adicione:
echo "GOOGLE_API_KEY=sua_chave_aqui" >> .env
```

### Erro: `Rate limit exceeded`

**Problema:** Limite gratuito Gemini atingido (15 req/min)

**Solução:**
- Aguarde 1 minuto
- Ou configure rate limiting no código
- Ou faça upgrade para API paga

### Erro: `Module not found: langgraph`

**Solução:**
```bash
# Reativar ambiente virtual
source .venv/bin/activate

# Reinstalar dependências
uv pip install -r requirements.txt
```

### Agente não busca dados

**Problema:** Sempre responde sem buscar contexto

**Solução:**
- Verificar implementação em `context.py`
- Melhorar prompt em `prompt.py` para instruir busca
- Adicionar exemplos de quando buscar

### Performance lenta

**Problema:** Respostas demoram muito

**Solução:**
- Usar `gemini-1.5-flash` em vez de `gemini-1.5-pro` (mais rápido)
- Reduzir tamanho do contexto
- Cache de respostas comuns
- Usar `uvicorn` com múltiplos workers

### Erro de importação `externally-managed-environment`

**Problema:** Sistema operacional não permite pip global

**Solução:**
```bash
# Sempre use ambiente virtual
uv venv --python 3.12
source .venv/bin/activate
uv pip install -r requirements.txt
```

## 🚀 Melhorias Futuras

- [ ] Conectar com API Fastify real para buscar anúncios
- [ ] Implementar memória de conversação (histórico)
- [ ] Adicionar autenticação (JWT)
- [ ] Cache de respostas comuns
- [ ] Suporte a múltiplos idiomas
- [ ] Integração com WhatsApp/Telegram
- [ ] Analytics de conversações
- [ ] Feedback do usuário (útil/não útil)

## 📚 Recursos

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [Google Gemini API](https://ai.google.dev/docs)
- [UV Package Manager](https://github.com/astral-sh/uv)

