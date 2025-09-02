import { FastifyInstance } from 'fastify';
import * as announcementController from "../controllers/announcement";



export default async function (fastify: FastifyInstance) {

    fastify.post("/c-a", announcementController.createAnnouncement);
    fastify.get("/g-a", announcementController.getAllAnnouncements);
    
}

