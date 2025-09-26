import { FastifyReply, FastifyRequest } from "fastify";
import * as AddressService from "../services/address";
import { AddressType } from "../schemas/address";

export async function createAddress(
  req: FastifyRequest<{ Body: AddressType }>,
  reply: FastifyReply
) {
  try {
    const newAddress = await AddressService.createAddress(req.server, req.body);
    return reply.code(201).send(newAddress);
  } catch (error) {
    req.log.error(error, 'Error creating address');
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

export async function getAddresses(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const addresses = await AddressService.getAddresses(req.server);
  return reply.code(200).send(addresses);
}