import {
  getWatchProviderRegions as getWatchProviderRegionsQuery,
  type TmdbConfigurationResponse,
  type TmdbShowWatchProviderResponse,
  type TmdbWatchProviderRegionsResponse,
  type WatchProviderDetails,
} from "../../api";
import { addToCache, retrieveFromCache } from "../../db/mongodb/cache";
import { logger } from "../../libs/logger";
import { getImages } from "../image";

export interface WatchProviderRegion {
  countryId: string;
  name: string;
}

export interface PricedWatchProviders {
  // pricingType: "flatrate" | "buy" | "ads" | "rent" | "free";
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

export const mapResponseToWatchProvider = (
  response: TmdbShowWatchProviderResponse,
  configuration: TmdbConfigurationResponse
): WatchProvider[] => {
  const providers = Object.entries(response.results);

  return providers.map(([region, providerData]) => {
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

export const getShowWatchProviders = async (
  id: string
): Promise<TmdbShowWatchProviderResponse> => {
  logger.profile("getShowWatchProviders");
  const cachedWatchProviders =
    await retrieveFromCache<TmdbShowWatchProviderResponse>(id, {
      "data.__type": "showWatchProviders",
    });

  if (cachedWatchProviders != null) {
    return cachedWatchProviders.data;
  }

  const result = await getShowWatchProviders(id);

  addToCache(id, { ...result, __type: "showWatchProviders" });

  logger.profile("getShowWatchProviders");

  return result;
};
