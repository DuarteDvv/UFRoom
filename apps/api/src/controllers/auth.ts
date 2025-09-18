import { FastifyReply, FastifyRequest } from "fastify";
import * as AuthService from "../services/auth";
import { RegisterType, LoginType } from "../schemas/auth";

export async function register(
  req: FastifyRequest<{ Body: RegisterType }>,
  reply: FastifyReply
) {
  try {
    const newUser = await AuthService.register(req.server, req.body);
    return reply.code(201).send({ message: "Usuário cadastrado com sucesso", user: newUser });
  } catch (error: any) {
    req.log.error(error, "Error registering user");
    if (error.message === "E-mail já cadastrado" || error.message === "CPF já cadastrado") {
      return reply.code(400).send({ error: error.message });
    }
    return reply.code(500).send({ error: "Internal server error" });
  }
}

export async function login(
  req: FastifyRequest<{ Body: LoginType }>,
  reply: FastifyReply
) {
  try {
    const user = await AuthService.login(req.server, req.body);
    return reply.code(200).send({ message: "Login realizado com sucesso", user });
  } catch (error: any) {
    req.log.error(error, "Error logging in user");
    if (error.message === "E-mail ou senha inválidos") {
      return reply.code(401).send({ error: error.message });
    }
    return reply.code(500).send({ error: "Internal server error" });
  }
}
