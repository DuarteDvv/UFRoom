import { FastifyInstance } from "fastify";
import { getAllUniversities } from "../controllers/university";
import { UniversityListResponse } from "../schemas/university";

export default async function universityRoutes(fastify: FastifyInstance) {
	fastify.get(
		"/api/universities",
		{
			schema: {
				response: {
					200: UniversityListResponse,
				},
			},
		},
		getAllUniversities
	);
}
