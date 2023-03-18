import { upsert } from "./upsert";
import dayjs from "dayjs";
import { retrieveOne } from "./retrieveOne";
import { type Document, type Filter } from "mongodb";

interface Cacheable<Data> {
  key: string;
  expiry: number;
  data: Data;
}

export const addToCache = async <Data>(
  key: string,
  data: Data
): Promise<Cacheable<Data>> => {
  const expiry = dayjs().add(3, "days").unix();
  const dataToCache: Cacheable<Data> = { key, data, expiry };
  const filter = { key };

  return await upsert("cache", dataToCache, filter);
};

export const retrieveFromCache = async <Data>(
  key: string,
  additionalFilter?: Filter<Document>
): Promise<Cacheable<Data> | null> => {
  const currentTimestamp = dayjs().unix();
  const filter: Filter<Document> = {
    key,
    expiry: { $gt: currentTimestamp },
    ...additionalFilter,
  };

  return await retrieveOne<Cacheable<Data>>("cache", filter);
};
