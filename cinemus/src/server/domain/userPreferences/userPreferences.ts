import { db } from "../../config";
import { retrieveOne } from "../../db/mongodb/retrieveOne";
import { upsert } from "../../db/mongodb/upsert";
import { logger } from "../../libs/logger";

interface UserPreferences {
  watchProviderRegion?: string;
}

const MONGO_COLLECTION = "userPreferences";

const EMPTY_PREFERENCES = { watchProviderRegion: undefined };

export const getUserPreferences = async (
  userId: string
): Promise<UserPreferences> => {
  logger.profile("getUserPreferences");
  console.log(db);

  const userPreferences = await retrieveOne<UserPreferences>(MONGO_COLLECTION, {
    userId,
  });

  logger.profile("getUserPreferences");

  return userPreferences !== null
    ? { watchProviderRegion: userPreferences.watchProviderRegion }
    : EMPTY_PREFERENCES;
};

export const updateUserPreferences = async (
  userId: string,
  data: Partial<UserPreferences>
): Promise<UserPreferences> => {
  logger.profile("updateUserPreferences");
  const existingPreferences = await getUserPreferences(userId);
  const updatedPreferences = { ...existingPreferences, ...data };
  const result = await upsert<UserPreferences>(
    MONGO_COLLECTION,
    updatedPreferences,
    {
      userId,
    }
  );
  logger.profile("updateUserPreferences");

  return result;
};
