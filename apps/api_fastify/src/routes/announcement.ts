import { FastifyInstance } from 'fastify';
import * as announcementController from "../controllers/announcement";



export default async function (fastify: FastifyInstance) {

    fastify.post("/announcement", announcementController.createAnnouncement);
    fastify.get("/announcement", announcementController.getAllAnnouncements);

}


