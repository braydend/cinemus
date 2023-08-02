import user from "~/server/db/prisma/user";

export const getAllUsers = async () => {
  return await user.getAllUsers();
};

export const getLatestSessionForUser = async (userId: string) => {
  return await user.getLatestSessionForUser(userId);
};
