import { FastifyReply, FastifyRequest } from "fastify";
import { SearchType } from "../schemas/search";
import * as SearchService from "../services/search";

export async function search(
  req: FastifyRequest<{ Body: SearchType }>,
  reply: FastifyReply
) 
{

  try {
    const { results, pagination } = await SearchService.searchRooms(
        req.server,
        req.body
    );
    
    return reply.send({ results, pagination });
  } catch (error) {
    console.error("Search error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}