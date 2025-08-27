import Fastify, { FastifyInstance } from 'fastify'

// Plugins
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'

// Tipos
interface ServerOptions {
  port?: number
  host?: string
  logger?: boolean
}

// Função para criar servidor
async function createServer(options: ServerOptions = {}) {
  const server: FastifyInstance = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      } : undefined
    }
  })

  // Registrar plugins de segurança
  await server.register(helmet, {
    contentSecurityPolicy: false
  })

  // CORS
  await server.register(cors, {
    origin: (origin, callback) => {
      const hostname = new URL(origin || '').hostname
      if (!origin || hostname === 'localhost' || hostname === '127.0.0.1') {
        callback(null, true)
        return
      }
      // Em produção, adicione seus domínios permitidos
      callback(new Error("Not allowed"), false)
    },
    credentials: true
  })

  // Rate limiting
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  })

  // Health check
  server.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  })

  // Registrar rotas
  await server.register(async function (server) {
    // Rota de exemplo
    server.get('/api/users', async () => {
      return [
        { id: 1, name: 'João', email: 'joao@ufroom.com' },
        { id: 2, name: 'Maria', email: 'maria@ufroom.com' }
      ]
    })

    // Rota com parâmetros
    server.get<{ Params: { id: string } }>('/api/users/:id', async (request) => {
      const { id } = request.params
      return { id: Number(id), name: `User ${id}`, email: `user${id}@ufroom.com` }
    })

    // Rota POST de exemplo
    server.post<{ Body: { name: string; email: string } }>('/api/users', async (request) => {
      const { name, email } = request.body
      return { 
        id: Date.now(), 
        name, 
        email, 
        created_at: new Date().toISOString() 
      }
    })
  })

  return server
}

// Iniciar servidor
async function start() {
  try {
    const server = await createServer()
    
    const port = Number(process.env.PORT) || 3001
    const host = process.env.HOST || '0.0.0.0'
    
    await server.listen({ port, host })
    
    console.log(`🚀 Server listening at http://${host}:${port}`)
    console.log(`📋 Health check: http://${host}:${port}/health`)
    
  } catch (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down...')
  process.exit(0)
})

// Iniciar apenas se executado diretamente
if (require.main === module) {
  start()
}

export { createServer }