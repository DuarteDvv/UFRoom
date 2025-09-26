import { FastifyReply, FastifyRequest } from "fastify";
import { getAllUniversities as getAllUniversitiesService } from "../services/university";

export async function getAllUniversities(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const universities = await getAllUniversitiesService(req.server);
    return reply.code(200).send(universities);
  } catch (error) {
    req.log.error(error, "Error fetching universities");
    return reply.code(500).send({ error: "Internal server error" });
  }
}
