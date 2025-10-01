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

export const AnnouncementFilters = Type.Object({
  sex_restriction: Type.Optional(SexRestrict),
  type_of: Type.Optional(PropertyType),
  min_price: Type.Optional(Type.Number({ minimum: 0 })),
  max_price: Type.Optional(Type.Number({ minimum: 0 })),
  min_available_spots: Type.Optional(Type.Number({ minimum: 1 })),
  status: Type.Optional(AnnouncementStatus),
  // A DECIDIR: COMO VAI FUNCIONAR FILTRO DE LOCALIZAÇÃO
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 20 })),
  sort_by: Type.Optional(Type.Union([Type.Literal('price'), Type.Literal('created_at')])),
  sort_order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')]))
})

export type AnnouncementFiltersType = Static<typeof AnnouncementFilters>

export const AnnouncementParams = Type.Object({
  id: Type.String({ pattern: '^[0-9]+$' })
})

export type AnnouncementParamsType = Static<typeof AnnouncementParams>

export const AnnouncementUpdate = Type.Partial(
  Type.Omit(Announcement, ['id', 'id_owner', 'created_at', 'updated_at'])
)

export type AnnouncementUpdateType = Static<typeof AnnouncementUpdate>
