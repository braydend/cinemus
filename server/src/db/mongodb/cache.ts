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
  data: Data,
  daysToCache: number = 3
): Promise<Cacheable<Data>> => {
  const expiry = dayjs().add(daysToCache, "days").unix();
  const dataToCache: Cacheable<Data> = { key, data, expiry };
  const filter = { key };

  console.log(
    `Adding to cache with key "${key}" and data: ${JSON.stringify(dataToCache)}`
  );

  const result = await upsert("cache", dataToCache, filter);

  console.log(
    `Added to cache with key "${key}" and data: ${JSON.stringify(dataToCache)}`
  );

  return result;
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

  console.log(
    `Search cache for key "${key}" with filter: ${JSON.stringify(filter)}`
  );

  const result = await retrieveOne<Cacheable<Data>>("cache", filter);

  console.log(
    `Cache ${
      result != null ? "hit" : "miss"
    } for key "${key}" with filter: ${JSON.stringify(filter)}`
  );

  return result;
};
