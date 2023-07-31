import { prisma } from "../../db";

const getUserById = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({ where: { id: userId } });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({ include: { sessions: true } });
};

const prismaUserFunctions = { getUserById, getAllUsers };

export default prismaUserFunctions;
