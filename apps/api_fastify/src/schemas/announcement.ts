import { Type, Static } from '@sinclair/typebox'

const PropertyType = Type.Union([
  Type.Literal('kitnet'),
  Type.Literal('individual_room'),
  Type.Literal('shared_room')
])

const AnnouncementStatus = Type.Union([
  Type.Literal('paused'),
  Type.Literal('rented'),
  Type.Literal('available')
])

const SexRestrict = Type.Union([
  Type.Literal('male'),
  Type.Literal('female'),
  Type.Literal('both')
])

export const Announcement = Type.Object({
  id: Type.Optional(Type.Number()),
  id_owner: Type.Number(),
  id_address: Type.Optional(Type.Number()),
  price: Type.Number({ minimum: 0 }),
  occupants: Type.Number({ minimum: 0 }),
  max_occupants: Type.Number({ minimum: 1 }),
  description: Type.Optional(Type.String()),
  type_of: PropertyType,
  status: AnnouncementStatus,
  title: Type.String({ maxLength: 255 }),
  sex_restriction: SexRestrict,
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
  rules: Type.Optional(Type.String())
})

export type AnnouncementType = Static<typeof Announcement>