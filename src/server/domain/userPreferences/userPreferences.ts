import {
  getUserPreferencesForUserId,
  updateUserPreferencesForUserId,
} from "../../db/prisma/userPreferences";
import { logger } from "../../libs/logger";

interface UserPreferences {
  watchProviderRegion?: string;
}

export const getUserPreferences = async (userId: string) => {
  logger.profile("getUserPreferences");

  const userPreferences = await getUserPreferencesForUserId(userId);

  logger.profile("getUserPreferences");

  return userPreferences;
};

export const updateUserPreferences = async (
  userId: string,
  data: UserPreferences
) => {
  logger.profile("updateUserPreferences");
  const updatedPreferences = await updateUserPreferencesForUserId(userId, data);
  logger.profile("updateUserPreferences");

  return updatedPreferences;
};
