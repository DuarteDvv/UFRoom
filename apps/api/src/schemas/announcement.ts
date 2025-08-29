import { Type, Static } from '@sinclair/typebox'

export const SexEnum = Type.Union([
  Type.Literal('Masculino'),
  Type.Literal('Feminino'),
  Type.Literal('Não binário'),
  Type.Literal('Outro')
])

export const Announcement = Type.Object({
  id: Type.Optional(Type.Number()), 
  id_owner: Type.Number(),
  id_address: Type.Number(),
  price: Type.Number({ minimum: 0 }), 
  vacancies: Type.Number({ minimum: 0 }),
  max_people: Type.Number({ minimum: 1 }),
  description: Type.Optional(Type.String()),
  title: Type.String({ maxLength: 255 }),
  sex: SexEnum, 
  created_at: Type.Optional(Type.String({ format: 'date' })),
  university: Type.Optional(Type.String({ maxLength: 50 }))
})

export type AnnouncementType = Static<typeof Announcement>