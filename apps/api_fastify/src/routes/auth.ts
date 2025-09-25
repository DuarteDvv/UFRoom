import { FastifyInstance } from "fastify";
import { register, login } from "../controllers/auth";
import { RegisterSchema, LoginSchema } from "../schemas/auth";

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

  fastify.post(
    "/auth/login",
    {
      schema: {
        body: LoginSchema,
      },
    },
    login
  );
}
