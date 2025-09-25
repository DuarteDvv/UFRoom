import { Type, Static } from '@sinclair/typebox'

export const Address = Type.Object({
  id: Type.Optional(Type.Number()),
  street: Type.String(),
  neighborhood: Type.String(),
  state: Type.String(),
  number: Type.Number(),
  city: Type.String(),
  cep: Type.String({ pattern: '^[0-9]{5}-?[0-9]{3}$', maxLength: 20 }),
  latitude: Type.Number({ minimum: -90, maximum: 90 }),
  longitude: Type.Number({ minimum: -180, maximum: 180 }),
  complement: Type.Optional(Type.String())
});

export type AddressType = Static<typeof Address>
