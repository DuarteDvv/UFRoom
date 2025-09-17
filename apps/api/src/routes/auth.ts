import { FastifyInstance } from "fastify";
import { register } from "../controllers/auth";
import { RegisterSchema } from "../schemas/auth";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/register",
    {
      schema: {
        body: RegisterSchema,
      },
    },
    register
  );
}
