import { FastifyReply, FastifyRequest } from 'fastify';
import * as AnnouncementService from '../services/announcement';

export async function createAnnouncement(
  req: FastifyRequest<{
    Body: { 
      id_owner: string,
      id_address: string,
      price: number,
      vacancy: number,
      max_people: number,
      description: string,
      title: string,
      rules: string,
      images: string[]
      sex: string,
      created_at: Date
      university: string
    }
  }>, reply: FastifyReply) {

  const newAnnouncement = await AnnouncementService.createAnnouncement(req.body);

  return reply.code(201).send(newAnnouncement);
}

export async function getAllAnnouncements(
  req: FastifyRequest, reply: FastifyReply) {

  const announcements = [await AnnouncementService.createAnnouncement({
    id_owner: "1",
    id_address: "1",
    price: 500,
    vacancy: 2,
    max_people: 4,
    description: "A nice place to live",
    title: "Room for rent",
    rules: "No smoking, no pets",
    images: ["image1.jpg", "image2.jpg"],
    sex: "Any",
    created_at: new Date(),
    university: "UFU"
  })];

  return reply.code(200).send(announcements);
}
    