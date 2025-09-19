import Fastify, { FastifyInstance } from 'fastify'

// Plugins
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import prismaPlugin from './plugins/prisma' 
import jwtPlugin from './plugins/jwt'
import fastifySensible from "fastify-sensible";

import addressRoutes from './routes/address'
import authRoutes from './routes/auth'
import ownerRoutes from './routes/owner'


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
      if (!origin) {
        callback(null, true)
        return
      }

      try {
        const hostname = new URL(origin).hostname
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          callback(null, true)
        } else {
          callback(new Error("Not allowed"), false)
        }
      } catch {
        callback(new Error("Invalid origin"), false)
      }
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
  
  // Registrando o plugin do Prisma
  await server.register(prismaPlugin)

  // Registrando o plugin JWT
  await server.register(jwtPlugin)

  await server.register(fastifySensible)

  // Registrando rotas de endereço
  await server.register(addressRoutes)
  await server.register(authRoutes)
  await server.register(ownerRoutes) 

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