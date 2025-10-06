import { FastifyInstance } from "fastify";
import { 
  createAnnouncement, 
  getAnnouncements, 
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement, 
  createAnnouncementImage
} from "../controllers/announcement";
import { 
  Announcement, 
  AnnouncementParams,
  AnnouncementUpdate 
} from "../schemas/announcement";
import { AnnouncementImageResponse } from "../schemas/annoucment_image";

export default async function announcementRoutes(fastify: FastifyInstance) {
  // Create announcement
  fastify.post(
    "/announcements",
    {
      schema: {
        body: Announcement,
      },
    },
    createAnnouncement
  );

  fastify.post(
    "/announcement-images",
    {
      schema: {
        body: AnnouncementImageResponse,
      },
    },
    createAnnouncementImage
  );

  fastify.get("/announcements", getAnnouncements);

  fastify.get(
    "/announcements/:id",
    {
      schema: {
        params: AnnouncementParams
      }
    },
    getAnnouncementById
  );

  fastify.put(
    "/announcements/:id",
    {
      schema: {
        params: AnnouncementParams,
        body: AnnouncementUpdate
      }
    },
    updateAnnouncement
  );

  fastify.delete(
    "/announcements/:id",
    {
      schema: {
        params: AnnouncementParams
      }
    },
    deleteAnnouncement
  );
}