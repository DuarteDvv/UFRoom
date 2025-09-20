import { FastifyReply, FastifyRequest } from "fastify";
import { SearchType } from "../schemas/search";
import * as SearchService from "../services/search";

export async function search(
  req: FastifyRequest<{ Body: SearchType }>,
  reply: FastifyReply
) 
{
  const { query, filters, page = 1, pageSize = 10 } = req.body;

  try {
    const { results, total } = await SearchService.searchProperties(
        req.server,
        query,
        filters,
        page,
        pageSize
    );

    return reply.send({ results, total, page, pageSize });
  } catch (error) {
    console.error("Search error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}