import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

export default fp(async (server) => {
  const prisma = new PrismaClient();

  server.addHook("onClose", async (server) => {   // desconecta quando o servidor fecha
    await prisma.$disconnect();
  });

  server.decorate("prisma", prisma); // injeta no fastify como `server.prisma`
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
