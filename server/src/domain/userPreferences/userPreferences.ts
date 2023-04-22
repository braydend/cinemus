import { retrieveOne } from "../../db/mongodb/retrieveOne";
import { upsert } from "../../db/mongodb/upsert";

interface UserPreferences {
  watchProviderRegion?: string;
}

const MONGO_COLLECTION = "userPreferences";

const EMPTY_PREFERENCES = { watchProviderRegion: undefined };

export const getUserPreferences = async (
  userId: string
): Promise<UserPreferences> => {
  const userPreferences = await retrieveOne<UserPreferences>(MONGO_COLLECTION, {
    userId,
  });

  return userPreferences !== null
    ? { watchProviderRegion: userPreferences.watchProviderRegion }
    : EMPTY_PREFERENCES;
};

export const updateUserPreferences = async (
  userId: string,
  data: Partial<UserPreferences>
): Promise<UserPreferences> => {
  const existingPreferences = await getUserPreferences(userId);
  const updatedPreferences = { ...existingPreferences, ...data };
  return await upsert<UserPreferences>(MONGO_COLLECTION, updatedPreferences, {
    userId,
  });
};
