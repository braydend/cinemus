import { prisma } from "~/server/db";
import type { Prisma } from "@prisma/client";

export const updateUserPreferencesForUserId = async (
  userId: string,
  input: Prisma.UserPreferencesUpdateInput
) => {
  return await prisma.userPreferences.update({
    where: { userId },
    data: input,
  });
};

export const getUserPreferencesForUserId = async (userId: string) => {
  return await findUserPreferencesForUserId(userId);
};

const findUserPreferencesForUserId = async (userId: string) => {
  const preferences = await prisma.userPreferences.findFirst({
    where: { userId },
  });

  if (preferences) {
    return preferences;
  }
  return await prisma.userPreferences.create({
    data: { userId },
  });
};
