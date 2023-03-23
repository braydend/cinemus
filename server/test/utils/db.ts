import { getDatabase } from "../../src/db/mongodb/instance";

const dropCollection = async (collectionName: string): Promise<void> => {
  const db = getDatabase();
  await db.dropCollection(collectionName);
};

export const dropAllCollections = async (): Promise<void> => {
  const db = getDatabase();
  const collections = await db.collections();
  for (const collection of collections) {
    await dropCollection(collection.collectionName);
  }
};
