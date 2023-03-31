import {
  getConfiguration as fetchConfiguration,
  type TmdbConfigurationResponse,
} from "../../api";
import { addToCache, retrieveFromCache } from "../../db/mongodb/cache";

export const getConfiguration =
  async (): Promise<TmdbConfigurationResponse> => {
    const cachedConfiguration =
      await retrieveFromCache<TmdbConfigurationResponse>("configuration");
    if (cachedConfiguration != null) {
      return cachedConfiguration.data;
    }

    const configuration = await fetchConfiguration();
    addToCache("configuration", configuration, 7);
    return configuration;
  };
