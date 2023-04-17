import {
  getWatchProviderRegions as getWatchProviderRegionsQuery,
  type TmdbWatchProviderRegionsResponse,
} from "../../api";
import { addToCache, retrieveFromCache } from "../../db/mongodb/cache";

export interface WatchProviderRegion {
  countryId: string;
  name: string;
}

const CACHE_KEY = "watchProviderRegions";

const mapResponseToRegion = (
  response: TmdbWatchProviderRegionsResponse
): WatchProviderRegion[] => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return response.results.map(({ iso_3166_1, native_name }) => ({
    name: native_name,
    countryId: iso_3166_1,
  }));
};

export const getWatchProviderRegions = async (): Promise<
  WatchProviderRegion[]
> => {
  const cachedProviders =
    await retrieveFromCache<TmdbWatchProviderRegionsResponse>(CACHE_KEY);

  if (cachedProviders != null) {
    return mapResponseToRegion(cachedProviders.data);
  }

  const response = await getWatchProviderRegionsQuery();

  addToCache(CACHE_KEY, response);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  return mapResponseToRegion(response);
};
