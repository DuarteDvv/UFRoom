import { FastifyInstance } from "fastify";


async function handler (request, reply) {
    return { status: "ok" };
}

export default async function (fastify: FastifyInstance) {

    fastify.get("/health", handler);
}