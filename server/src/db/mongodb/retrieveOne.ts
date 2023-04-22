import { getDatabase } from "./instance";
import { type Filter } from "mongodb";

export const retrieveOne = async <Data extends object>(
  collection: string,
  filter: Filter<unknown>
): Promise<Data | null> => {
  const db = getDatabase();
  const mongoCollection = db.collection(collection);

  try {
    return await mongoCollection.findOne<Data>(filter);
  } catch (e) {
    console.error("retrieveOne", (e as Error).message);
    throw Error(
      `Failed to retrieve from collection "${collection}" with filter: ${JSON.stringify(
        filter
      )}. ${(e as Error).message}`
    );
  }
};
