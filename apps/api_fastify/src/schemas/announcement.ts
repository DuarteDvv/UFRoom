import { Type, Static } from "@sinclair/typebox";

export const AnnouncementSchema = Type.Object({

});

export type Announcement = Static<typeof AnnouncementSchema>;