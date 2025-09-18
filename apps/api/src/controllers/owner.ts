import { FastifyReply, FastifyRequest } from "fastify";
import * as OwnerService from "../services/owner";
import { OwnerType } from "../schemas/owner";

export async function login(
  req: FastifyRequest<{ Body: OwnerType }>,
  reply: FastifyReply
) {
  try {
    const loginToken = await OwnerService.login(req.server, req.body);
    return reply.code(201).send(loginToken);
  } catch (error) {
    req.log.error(error, 'Error creating address');
    return reply.code(500).send({ error: 'Internal server error' });
  }
}