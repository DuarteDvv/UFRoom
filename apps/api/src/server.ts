import Fastify from 'fastify'
import health from './routes/health'
import announcement from './routes/announcement'
import prismaPlugin from './plugins/prisma'

const fastify = Fastify({
  logger: true
})

fastify.register(prismaPlugin)
fastify.register(announcement)
fastify.register(health)

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server listening at ${address}`)
})