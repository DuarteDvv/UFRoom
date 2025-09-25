import { FastifyInstance } from "fastify";
import { login } from "../controllers/owner";
import { Owner } from "../schemas/owner";

export default async function ownerRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      schema: {
        body: Owner
      },
    },
    login
  );

  
}