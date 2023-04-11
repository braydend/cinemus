import { upsert } from "./upsert";
import dayjs from "dayjs";
import { retrieveOne } from "./retrieveOne";
import { type Document, type Filter } from "mongodb";
import { logger } from "../../libs/logger";

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

  logger.info(
    `Adding to cache with key "${key}" and data: ${JSON.stringify(dataToCache)}`
  );

  const result = await upsert("cache", dataToCache, filter);

  logger.info(
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

  logger.profile(`Cache lookup: key="${key}" filter=${JSON.stringify(filter)}`);

  const result = await retrieveOne<Cacheable<Data>>("cache", filter);

  logger.profile(`Cache lookup: key="${key}" filter=${JSON.stringify(filter)}`);
  logger.info(
    `Cache ${
      result != null ? "hit" : "miss"
    } for key "${key}" with filter: ${JSON.stringify(filter)}`
  );

  return result;
};
