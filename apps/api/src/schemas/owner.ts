import { Type, Static } from '@sinclair/typebox'

export const Owner = Type.Object({
  id: Type.Optional(Type.Number()), 
  email: Type.String({ format: 'email', maxLength: 255 }),
  name: Type.String({ maxLength: 255 }),
  cpf: Type.String({ maxLength: 14 }),
  entry_at: Type.Optional(Type.String({ format: 'date' })), 
  phone_number: Type.Optional(Type.String({ maxLength: 20 })),
  img_url: Type.Optional(Type.String({ format: 'uri' })),
  password: Type.String({ minLength: 6, maxLength: 60 })
})

export type OwnerType = Static<typeof Owner>