import { Type, Static } from '@sinclair/typebox'

export const Address = Type.Object({
  id: Type.Optional(Type.Number()),
  street: Type.String(),
  neighborhood: Type.String(),
  state: Type.String(),
  number: Type.Number(),
  city: Type.String(),
  cep: Type.String({ maxLength: 20 }),
  latitude: Type.Number(),
  longitude: Type.Number(),
  complement: Type.Optional(Type.String())
});

export type AddressType = Static<typeof Address>
