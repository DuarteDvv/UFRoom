import { FastifyInstance } from "fastify";
import { compare } from "bcryptjs"; 
import { OwnerType } from "../schemas/owner";


export async function login(
  server: FastifyInstance,
  data: OwnerType
) {

  const cpf:string = data.cpf;

  const owner = await server.prisma.owner.findUnique({
    where: {cpf},
  });

  if (!owner) {
    throw server.httpErrors.unauthorized("Invalid CPF or password");
  }

  const isValid = await compare(data.password, owner.password);
  if (!isValid) {
    throw server.httpErrors.unauthorized("Invalid CPF or password");
  }

  const token = server.jwt.sign({ sub: owner.id, cpf: owner.cpf });
  return { access_token: token, token_type: "bearer" };
}