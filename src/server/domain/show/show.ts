import {
  getShow as fetchShow,
  searchShows as searchShowRequest,
  type TmdbShowDetails,
} from "~/server/externalApi/tmdb";
import { logger } from "../../libs/logger";
import {
  mapMediaDetailsToMedia,
  mapSearchResponseToMediaList,
  type MediaResponse,
  type MediaList,
} from "../media";
import { getConfiguration } from "../configuration";
import { getShowWatchProviders } from "../watchProviders";
import { addToCache, retrieveFromCache } from "../../db/upstash/cache";
import type { Media } from "@prisma/client";

export const hydrateShow = async (show: Media, region?: string) => {
  logger.profile(`getShow #${show.id}`);
  const cacheKey = `show-${show.id}`;
  const [cachedShow, configuration] = await Promise.all([
    retrieveFromCache<TmdbShowDetails>(cacheKey),
    getConfiguration(),
  ]);

  const watchProviders =
    region != null
      ? await getShowWatchProviders(show.id, configuration, region)
      : undefined;

  if (cachedShow != null) {
    return mapMediaDetailsToMedia(cachedShow, configuration, watchProviders);
  }

  const fetchedShow = await fetchShow(show.id);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  addToCache(cacheKey, fetchedShow);

  const mappedMedia = mapMediaDetailsToMedia(
    fetchedShow,
    configuration,
    watchProviders
  );

  logger.profile(`getShow #${show.id}`);

  return { ...mappedMedia, isWatched: show.isWatched };
};

export const searchShows = async (query: string): Promise<MediaList> => {
  logger.profile(`searchShows: ${query}`);
  const [{ results }, configuration] = await Promise.all([
    searchShowRequest(query),
    getConfiguration(),
  ]);

  // for (const show of results) {
  // const cacheKey = `show-${show.id.toString(10)}`;
  // Don't await caching of data returned from API
  // TODO: Search results aren't being cached since the shape is different to the "get" result
  // addToCache(cacheKey, show);
  // getShow(show.id)
  // }

  const mappedMedia = mapSearchResponseToMediaList(results, configuration);
  logger.profile(`searchShows: ${query}`);

  return mappedMedia;
};
