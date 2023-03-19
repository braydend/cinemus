import { type Db, MongoClient, type MongoClient as ClientType } from "mongodb";
import { db } from "../../config";

let client: ClientType;

export const getDatabase = (): Db => {
  if (!client) {
    const uri = db.MONGO_CONNECTION_STRING;
    console.log(db);
    client = new MongoClient(uri);
  }

  return client.db(db.DATABASE_NAME);
};
