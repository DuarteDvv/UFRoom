import { FastifyInstance } from "fastify";
import { search } from "../controllers/search";
import { SearchSchema } from "../schemas/search";

export default async function searchRoutes(fastify: FastifyInstance) {

  fastify.post(
    "/api/search", 
    { 
        schema: {
            body: SearchSchema
        }
    },
    search
  );




};
