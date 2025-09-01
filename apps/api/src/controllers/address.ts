import { FastifyReply, FastifyRequest } from "fastify";
import * as AddressService from "../services/address";
import { AddressType } from "../schemas/address";

export async function createAddress(
  req: FastifyRequest<{ Body: AddressType }>,
  reply: FastifyReply
) {
  const newAddress = await AddressService.createAddress(req.body);
  return reply.code(201).send(newAddress);
}

export async function getAddresses(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const addresses = await AddressService.getAddresses();
  return reply.code(200).send(addresses);
}