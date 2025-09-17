import { FastifyInstance } from "fastify";
import { RegisterType } from "../schemas/auth";
import bcrypt from "bcryptjs";

export async function register(server: FastifyInstance, data: RegisterType) {
  const { name, email, cpf, phone, password } = data;

  const existingEmail = await server.prisma.owner.findUnique({
    where: { email },
  });
  if (existingEmail) {
    throw new Error("E-mail já cadastrado");
  }

  const existingCPF = await server.prisma.owner.findUnique({
    where: { cpf },
  });
  if (existingCPF) {
    throw new Error("CPF já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const cleanCPF = cpf.replace(/\D/g, '');

  const newUser = await server.prisma.owner.create({
    data: {
      name,
      email,
      cpf: cleanCPF,
      phone,
      password: hashedPassword,
    },
  });
  return newUser;
}
