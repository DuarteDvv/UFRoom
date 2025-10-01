import { FastifyInstance } from "fastify";
import { 
  AnnouncementType, 
  AnnouncementFiltersType,
  AnnouncementUpdateType 
} from "../schemas/announcement";

export async function createAnnouncement(
  server: FastifyInstance, 
  data: AnnouncementType
) {
  return server.prisma.announcement.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    },
    include: {
      address: true,
      owner: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });
}

export async function getAnnouncements(
  server: FastifyInstance,
  filters: AnnouncementFiltersType
) {
  const {
    sex_restriction,
    type_of,
    min_price,
    max_price,
    min_available_spots,
    status = 'available',
    page = 1,
    limit = 20,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = filters;

  // Construir filtros do Prisma
  const where: any = {
    status
  };

  if (sex_restriction) {
    where.sex_restriction = sex_restriction;
  }

  if (type_of) {
    where.type_of = type_of;
  }

  if (min_price !== undefined || max_price !== undefined) {
    where.price = {};
    if (min_price !== undefined) where.price.gte = min_price;
    if (max_price !== undefined) where.price.lte = max_price;
  }

  // A DECIDIR: COMO IMPLEMENTAR FILTRO DE LOCALIZAÇÃO

  const skip = (page - 1) * limit;

  // Ordenação
  const orderBy: any = {};
  orderBy[sort_by] = sort_order;

  let announcements = await server.prisma.announcement.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      address: true,
      owner: {
        select: {
          id: true,
          name: true
        }
      },
      announcement_img: {
        take: 1
      }
    }
  });

  // Filtrar por vagas disponíveis (pós-query)
  // Vagas disponíveis = max_occupants - occupants
  if (min_available_spots !== undefined) {
    announcements = announcements.filter(a => 
      (a.max_occupants - a.occupants) >= min_available_spots
    );
  }

  const total = await server.prisma.announcement.count({ where });

  return {
    data: announcements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getAnnouncementById(
  server: FastifyInstance,
  id: number
) {
  return server.prisma.announcement.findUnique({
    where: { id },
    include: {
      address: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      announcement_img: true,
      announcement_university: {
        include: {
          university: true
        }
      }
    }
  });
}

export async function updateAnnouncement(
  server: FastifyInstance,
  id: number,
  data: AnnouncementUpdateType
) {
  try {
    return await server.prisma.announcement.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      },
      include: {
        address: true,
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

export async function deleteAnnouncement(
  server: FastifyInstance,
  id: number
) {
  try {
    await server.prisma.announcement.delete({
      where: { id }
    });
    return true;
  } catch (error: any) {
    if (error.code === 'P2025') {
      return false;
    }
    throw error;
  }
}