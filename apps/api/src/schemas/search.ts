import { Type, Static } from "@sinclair/typebox";

export const SearchSchema = Type.Object({
  query: Type.String(),
  filters: Type.Optional(Type.Array(Type.String())),
  page: Type.Optional(Type.Number()),
  pageSize: Type.Optional(Type.Number()),
});

export type SearchType = Static<typeof SearchSchema>;