import { FastifyInstance } from "fastify";
import { RegisterType, LoginType } from "../schemas/auth";
import bcrypt from "bcryptjs";

export async function register(server: FastifyInstance, data: RegisterType) {
  const { name, email, cpf, phone, password } = data;

  const existingEmail = await server.prisma.owner.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error("E-mail já cadastrado");
  }

  const cleanCPF = cpf.replace(/\D/g, '');

  const existingCPF = await server.prisma.owner.findUnique({
    where: { cpf: cleanCPF },
  });

  if (existingCPF) {
    throw new Error("CPF já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  

  const newUser = await server.prisma.owner.create({
    data: {
      name: name,
      email: email,
      cpf: cleanCPF,
      phone: phone,
      password: hashedPassword
    },
  });

  return newUser;
}

export async function login(server: FastifyInstance, data: LoginType) {
  const { email, password } = data;

  const user = await server.prisma.owner.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("E-mail ou senha inválidos");
  }

  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("E-mail ou senha inválidos");
  }


  // Gerar o token JWT e retornar para o frontend
  const token = server.jwt.sign({ sub: user.id, email: user.email });
  return { 
    access_token: token, 
    token_type: "bearer",
    user: { id: user.id, name: user.name, email: user.email }
  };
}
