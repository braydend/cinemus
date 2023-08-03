import user from "~/server/db/prisma/user";

export const getAllUsers = async () => {
  return await user.getAllUsers();
};
