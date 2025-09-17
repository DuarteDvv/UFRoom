import { Type, Static } from '@sinclair/typebox'

export const Owner = Type.Object({
  id: Type.Optional(Type.Number()), 
  id_address: Type.Number(),
  name: Type.String({ maxLength: 255 }),
  cpf: Type.String({ maxLength: 14 }),
  email: Type.String({ format: 'email', maxLength: 255 }), 
  entry_at: Type.String({ format: 'date' }), 
  phone_number: Type.String({ maxLength: 20 }),
  img_url: Type.String({ format: 'uri' }) 
})

export type OwnerType = Static<typeof Owner>