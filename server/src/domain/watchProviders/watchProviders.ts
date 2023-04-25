import {
  getWatchProviderRegions as getWatchProviderRegionsQuery,
  type TmdbConfigurationResponse,
  type TmdbWatchProviderResponse,
  type TmdbWatchProviderRegionsResponse,
  type WatchProviderDetails,
  getShowWatchProviders as fetchShowWatchProviders,
  getMovieWatchProviders as fetchMovieWatchProviders,
} from "../../api";
import { addToCache, retrieveFromCache } from "../../db/mongodb/cache";
import { logger } from "../../libs/logger";
import { getImages } from "../image";

type MediaCategory = "movie" | "tv";

export interface WatchProviderRegion {
  countryId: string;
  name: string;
}

export interface PricedWatchProviders {
  name: string;
  logoUrl: string;
}

type PricingOption = "flatrate" | "buy" | "ads" | "rent" | "free";

export type WatchProvider = {
  [pricingOption in PricingOption]?: PricedWatchProviders[];
} & {
  region: string;
};

const CACHE_KEY = "watchProviderRegions";

const buildPricedWatchProvider = (
  details: WatchProviderDetails[],
  configuration: TmdbConfigurationResponse
): PricedWatchProviders[] => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return details.map(({ provider_name, logo_path }) => ({
    name: provider_name,
    logoUrl: getImages(logo_path, configuration).logo.original ?? "",
  }));
};

const filterWatchProvidersByRegion = (
  region: string,
  providers: WatchProvider[]
): WatchProvider[] => {
  return providers.filter(
    ({ region: providerRegion }) => region === providerRegion
  );
};

export const mapResponseToWatchProvider = (
  response: TmdbWatchProviderResponse,
  configuration: TmdbConfigurationResponse,
  region?: string
): WatchProvider[] => {
  const providers = Object.entries(response.results);

  const mappedProviders = providers.map(([region, providerData]) => {
    return {
      region,
      free:
        providerData.free != null
          ? buildPricedWatchProvider(providerData.free, configuration)
          : undefined,
      buy:
        providerData.buy != null
          ? buildPricedWatchProvider(providerData.buy, configuration)
          : undefined,
      ads:
        providerData.ads != null
          ? buildPricedWatchProvider(providerData.ads, configuration)
          : undefined,
      flatrate:
        providerData.flatrate != null
          ? buildPricedWatchProvider(providerData.flatrate, configuration)
          : undefined,
      rent:
        providerData.rent != null
          ? buildPricedWatchProvider(providerData.rent, configuration)
          : undefined,
    };
  });

  return region != null
    ? filterWatchProvidersByRegion(region, mappedProviders)
    : mappedProviders;
};

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
  logger.profile("getWatchProviderRegions");
  const cachedProviders =
    await retrieveFromCache<TmdbWatchProviderRegionsResponse>(CACHE_KEY);

  if (cachedProviders != null) {
    return mapResponseToRegion(cachedProviders.data);
  }

  const response = await getWatchProviderRegionsQuery();

  addToCache(CACHE_KEY, response);

  const mappedRegions = mapResponseToRegion(response);
  logger.profile("getWatchProviderRegions");

  return mappedRegions;
};

const getWatchProviders = async (
  id: string,
  type: MediaCategory,
  configuration: TmdbConfigurationResponse,
  region?: string
): Promise<WatchProvider[]> => {
  const isMovie = type === "movie";
  const mediaType = isMovie ? "movie" : "show";

  const cachedWatchProviders =
    await retrieveFromCache<TmdbWatchProviderResponse>(id, {
      "data.__type": `${mediaType}WatchProviders`,
    });

  if (cachedWatchProviders != null) {
    return mapResponseToWatchProvider(
      cachedWatchProviders.data,
      configuration,
      region
    );
  }

  const result = isMovie
    ? await fetchMovieWatchProviders(id)
    : await fetchShowWatchProviders(id);

  addToCache(id, { ...result, __type: `${mediaType}WatchProviders` });

  return mapResponseToWatchProvider(result, configuration, region);
};

export const getShowWatchProviders = async (
  id: string,
  configuration: TmdbConfigurationResponse,
  region?: string
): Promise<WatchProvider[]> => {
  logger.profile("getShowWatchProviders");

  const data = await getWatchProviders(id, "tv", configuration, region);

  logger.profile("getShowWatchProviders");

  return data;
};

export const getMovieWatchProviders = async (
  id: string,
  configuration: TmdbConfigurationResponse,
  region?: string
): Promise<WatchProvider[]> => {
  logger.profile("getMovieWatchProviders");

  const data = await getWatchProviders(id, "movie", configuration, region);

  logger.profile("getMovieWatchProviders");

  return data;
};
