import { Type, Static } from "@sinclair/typebox";

export const SearchSchema = Type.Object({
  query: Type.String(),
  filters: Type.Optional(Type.Object({
    max_price: Type.Optional(Type.String()),
    open_vac: Type.Optional(Type.String()),
    room_type: Type.Optional(Type.String()),
    status: Type.Optional(Type.String()),
    sex_restriction: Type.Optional(Type.String()),
    near_university: Type.Optional(Type.String()),
    location: Type.Optional(Type.String()),
  })),
});

export type SearchType = Static<typeof SearchSchema>;