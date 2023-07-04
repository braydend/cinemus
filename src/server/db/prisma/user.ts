import { prisma } from "../../db";

const getUserById = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({ where: { id: userId } });
};

const prismaUserFunctions = { getUserById };

export default prismaUserFunctions;
