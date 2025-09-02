import { FastifyInstance } from 'fastify';
import * as announcementController from "../controllers/announcement";



export default async function (fastify: FastifyInstance) {

    fastify.post("/announcement", announcementController.createAnnouncement);
    fastify.get("/announcement", announcementController.getAllAnnouncements);
    fastify.get("/announcement/:id", announcementController.getAnnouncementById);
    fastify.put("/announcement/:id", announcementController.updateAnnouncement);
    fastify.delete("/announcement/:id", announcementController.deleteAnnouncement);

}

