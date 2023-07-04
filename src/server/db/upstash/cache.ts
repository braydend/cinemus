import { Redis } from "@upstash/redis";
import { logger } from "../../libs/logger";
import { upstash } from "../../config";

let instance: Redis;

export const createCacheInstance = (): void => {
  instance = new Redis({
    url: "https://crucial-bird-36093.upstash.io",
    token: upstash.REDIS_API_KEY,
  });
};

const getInstance = (): Redis => {
  logger.profile(`get cache instance`);

  if (instance == null) {
    logger.info("creating cache instance");
    createCacheInstance();
  }

  logger.profile(`get cache instance`);
  return instance;
};
export const addToCache = async <Data>(
  key: string,
  data: Data,
  daysToCache = 3
): Promise<Data> => {
  logger.profile(`addToCache (key: ${key})`);
  const instance = getInstance();
  const secondsToCache = daysToCache * 24 * 60 * 60;

  logger.info(
    `Adding to cache with key "${key}" and data: ${JSON.stringify(data)}`
  );

  const result = await instance.set(key, data, { ex: secondsToCache });

  if (result !== null) {
    logger.info(
      `Added to cache with key "${key}" and data: ${JSON.stringify(data)}`
    );
  }

  logger.profile(`addToCache (key: ${key})`);
  return data;
};

export const retrieveFromCache = async <Data>(
  key: string
): Promise<Data | null | undefined> => {
  try {
    logger.profile(`Cache lookup: key="${key}"`);
    logger.info("get Instance");
    const instance = getInstance();

    logger.info("retrieve from cache");
    const result = await instance.get<Data>(key);

    logger.info(`Cache ${result != null ? "hit" : "miss"} for key "${key}"`);

    logger.profile(`Cache lookup: key="${key}"`);
    return result;
  } catch (e) {
    logger.error(`Error retrieving from cache: ${(e as Error).message}`);
  }
};

export const clearCache = async (): Promise<void> => {
  const instance = getInstance();

  await instance.flushall();
};
