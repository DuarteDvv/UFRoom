import { FastifyInstance } from "fastify";
import { 
  AnnouncementType, 
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

export async function getAnnouncements(server: FastifyInstance) {
  return server.prisma.announcement.findMany({
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
      },
      announcement_university: {
        include: {
          university: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
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
          email: true,
          phone: true,
          img_url: true
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