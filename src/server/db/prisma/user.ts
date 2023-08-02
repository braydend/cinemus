import { prisma } from "../../db";

const getUserById = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({ where: { id: userId } });
};

const getLatestSessionForUser = async (userId: string) => {
  return await prisma.session.findFirst({
    where: { userId },
    orderBy: { expires: "desc" },
    select: { sessionToken: true },
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({ include: { sessions: true } });
};

const prismaUserFunctions = {
  getUserById,
  getAllUsers,
  getLatestSessionForUser,
};

export default prismaUserFunctions;
