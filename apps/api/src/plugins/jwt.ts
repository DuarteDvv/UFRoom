import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async (server: FastifyInstance) => {
  server.register(import("fastify-jwt"), {
    secret: "super-secret",
  });

  server.decorate(
    "authenticate",
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
});
