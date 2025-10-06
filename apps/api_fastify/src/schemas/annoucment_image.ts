import { Type, Static } from "@sinclair/typebox";

const NullableString = Type.Union([Type.String(), Type.Null()]);
const NullableNumber = Type.Union([Type.Number(), Type.Null()]);
const NullableBoolean = Type.Union([Type.Boolean(), Type.Null()]);

export const AnnouncementImageResponse = Type.Object({
  id: Type.Optional(Type.Number()),
  id_announcement: Type.Number(),
  img_url: Type.String(),
  order_idx: NullableNumber,      
  is_cover: NullableBoolean      
});

export const AnnouncementImageListResponse = Type.Array(AnnouncementImageResponse);

export type AnnouncementImageResponseType = Static<typeof AnnouncementImageResponse>;
export type AnnouncementImageType = Static<typeof AnnouncementImageResponse>;
