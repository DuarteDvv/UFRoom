import { Type, Static } from '@sinclair/typebox'

export const Owner = Type.Object({
  id: Type.Optional(Type.Number()), 
  id_address: Type.Number(),
  name: Type.String({ maxLength: 255 }),
  cpf: Type.String({ maxLength: 14 }),
  entry_at: Type.Optional(Type.String({ format: 'date' })), 
  phone_number: Type.Optional(Type.String({ maxLength: 20 })),
  img_url: Type.Optional(Type.String({ format: 'uri' })) 
})

export type OwnerType = Static<typeof Owner>