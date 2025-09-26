import { FastifyInstance } from "fastify";
import { UniversityResponseType } from "../schemas/university";

export async function getAllUniversities(
  server: FastifyInstance
): Promise<UniversityResponseType[]> {
  const universities = await server.prisma.university.findMany({
    select: {
      id: true,
      name: true,
      abbreviation: true,
      latitude: true,
      longitude: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return universities.map((uni) => ({
    id: uni.id,
    name: uni.name,
    abbreviation: uni.abbreviation ?? null,
    latitude:
      uni.latitude === null
        ? null
        : typeof uni.latitude === "number"
        ? uni.latitude
        : Number(uni.latitude),
    longitude:
      uni.longitude === null
        ? null
        : typeof uni.longitude === "number"
        ? uni.longitude
        : Number(uni.longitude),
  }));
}
