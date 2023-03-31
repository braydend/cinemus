import { getConfiguration, type TmdbConfigurationResponse } from "../../api";
import { addToCache, retrieveFromCache } from "../../db/mongodb/cache";

export const getImageConfiguration =
  async (): Promise<TmdbConfigurationResponse> => {
    const cachedConfiguration =
      await retrieveFromCache<TmdbConfigurationResponse>("configuration");
    if (cachedConfiguration != null) {
      return cachedConfiguration.data;
    }

    const configuration = await getConfiguration();
    addToCache("configuration", configuration, 7);
    return await getConfiguration();
  };
