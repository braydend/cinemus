import { getDatabase } from "./instance";
import { type Document, type Filter, type UpdateFilter } from "mongodb";

export const upsert = async <Data extends object>(
  collection: string,
  data: Data,
  filter: Filter<Document>
): Promise<Data> => {
  const db = getDatabase();
  const mongoCollection = db.collection(collection);
  const update: UpdateFilter<unknown> = { $set: data };

  try {
    await mongoCollection.updateOne(filter, update, { upsert: true });

    return data;
  } catch (e) {
    throw Error(
      `Failed to upsert in collection "${collection}" with data: ${JSON.stringify(
        data
      )}. ${(e as Error).message}`
    );
  }
};
