import { getDatabase } from "../../src/db/mongodb/instance";

const dropCollection = async (collectionName: string) => {
  const db = getDatabase();
  await db.dropCollection(collectionName);
};

export const dropAllCollections = async () => {
  const db = getDatabase();
  const collections = await db.collections();
  for (const collection of collections) {
    await dropCollection(collection.collectionName);
  }
};
