import { Type, Static } from "@sinclair/typebox";

export const RegisterSchema = Type.Object({
  name: Type.String({ minLength: 3 }),
  email: Type.String({ format: "email" }),
  cpf: Type.String({ pattern: "^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}$" }),
  phone: Type.String({ pattern: "^\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}$" }),
  password: Type.String({ minLength: 6 }),
});

export type RegisterType = Static<typeof RegisterSchema>;
