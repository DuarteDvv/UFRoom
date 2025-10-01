import { FastifyReply, FastifyRequest } from "fastify";
import * as AnnouncementService from "../services/announcement";
import { 
  AnnouncementType, 
  AnnouncementParamsType,
  AnnouncementUpdateType 
} from "../schemas/announcement";

export async function createAnnouncement(
  req: FastifyRequest<{ Body: AnnouncementType }>,
  reply: FastifyReply
) {
  try {
    const newAnnouncement = await AnnouncementService.createAnnouncement(
      req.server, 
      req.body
    );
    return reply.code(201).send(newAnnouncement);
  } catch (error) {
    req.log.error(error, 'Error creating announcement');
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

export async function getAnnouncements(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const announcements = await AnnouncementService.getAnnouncements(req.server);
    return reply.code(200).send(announcements);
  } catch (error) {
    req.log.error(error, 'Error fetching announcements');
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

export async function getAnnouncementById(
  req: FastifyRequest<{ Params: AnnouncementParamsType }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;
    const announcement = await AnnouncementService.getAnnouncementById(
      req.server, 
      parseInt(id)
    );
    
    if (!announcement) {
      return reply.code(404).send({ error: 'Announcement not found' });
    }
    
    return reply.code(200).send(announcement);
  } catch (error) {
    req.log.error(error, 'Error fetching announcement');
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

export async function updateAnnouncement(
  req: FastifyRequest<{ Params: AnnouncementParamsType; Body: AnnouncementUpdateType }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;
    const updatedAnnouncement = await AnnouncementService.updateAnnouncement(
      req.server,
      parseInt(id),
      req.body
    );
    
    if (!updatedAnnouncement) {
      return reply.code(404).send({ error: 'Announcement not found' });
    }
    
    return reply.code(200).send(updatedAnnouncement);
  } catch (error) {
    req.log.error(error, 'Error updating announcement');
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

export async function deleteAnnouncement(
  req: FastifyRequest<{ Params: AnnouncementParamsType }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;
    const deleted = await AnnouncementService.deleteAnnouncement(
      req.server,
      parseInt(id)
    );
    
    if (!deleted) {
      return reply.code(404).send({ error: 'Announcement not found' });
    }
    
    return reply.code(200).send({ message: 'Announcement deleted successfully' });
  } catch (error) {
    req.log.error(error, 'Error deleting announcement');
    return reply.code(500).send({ error: 'Internal server error' });
  }
}