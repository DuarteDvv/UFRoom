import { prisma } from "../prisma";
import { AddressType } from "../schemas/address";

export async function createAddress(data: AddressType) {
  return prisma.address.create({
    data,
  });
}

export async function getAddresses() {
  return prisma.address.findMany();
}