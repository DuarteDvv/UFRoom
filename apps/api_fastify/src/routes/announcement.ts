import { FastifyInstance } from "fastify";
import { 
  createAnnouncement, 
  getAnnouncements, 
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement 
} from "../controllers/announcement";
import { 
  Announcement, 
  AnnouncementFilters, 
  AnnouncementParams,
  AnnouncementUpdate 
} from "../schemas/announcement";

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

  // Get all announcements with filters
  fastify.get(
    "/announcements",
    {
      schema: {
        querystring: AnnouncementFilters
      }
    },
    getAnnouncements
  );

  // Get specific announcement by ID
  fastify.get(
    "/announcements/:id",
    {
      schema: {
        params: AnnouncementParams
      }
    },
    getAnnouncementById
  );

  // Update announcement
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

  // Delete announcement
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