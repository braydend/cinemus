import {
  getConfiguration as fetchConfiguration,
  type TmdbConfigurationResponse,
} from "~/server/externalApi";
import { addToCache, retrieveFromCache } from "../../db/upstash/cache";

// TODO: prevent this from hitting Mongo for every cache lookup. Need an in-memory cache layer too probably
export const getConfiguration =
  async (): Promise<TmdbConfigurationResponse> => {
    const cachedConfiguration =
      await retrieveFromCache<TmdbConfigurationResponse>("configuration");

    if (cachedConfiguration != null) {
      return cachedConfiguration;
    }

    const configuration = await fetchConfiguration();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    addToCache("configuration", configuration, 7);
    return configuration;
  };
