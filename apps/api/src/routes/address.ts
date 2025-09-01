import { FastifyInstance } from "fastify";
import { createAddress, getAddresses } from "../controllers/address";
import { Address } from "../schemas/address";

export default async function addressRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/addresses",
    {
      schema: {
        body: Address,
      },
    },
    createAddress
  );

  fastify.get("/addresses", getAddresses);
}