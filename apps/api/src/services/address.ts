import { FastifyInstance } from "fastify";
import { AddressType } from "../schemas/address";

export async function createAddress(server: FastifyInstance, data: AddressType) {
  return server.prisma.address.create({
    data,
  });
}

export async function getAddresses(server: FastifyInstance) {
  return server.prisma.address.findMany();
}
