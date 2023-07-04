import {
  getShow as fetchShow,
  searchShows as searchShowRequest,
  type TmdbShowDetails,
} from "~/server/externalApi/tmdb";
import { logger } from "../../libs/logger";
import {
  mapMediaDetailsToMedia,
  mapSearchResponseToMediaList,
  type Media,
  type MediaList,
} from "../media";
import { getConfiguration } from "../configuration";
import { getShowWatchProviders } from "../watchProviders";
import { addToCache, retrieveFromCache } from "../../db/upstash/cache";

export const getShow = async (id: string, region?: string): Promise<Media> => {
  logger.profile(`getShow #${id}`);
  const cacheKey = `show-${id}`;
  const [cachedShow, configuration] = await Promise.all([
    retrieveFromCache<TmdbShowDetails>(cacheKey),
    getConfiguration(),
  ]);

  const watchProviders =
    region != null
      ? await getShowWatchProviders(id, configuration, region)
      : undefined;

  if (cachedShow != null) {
    return mapMediaDetailsToMedia(cachedShow, configuration, watchProviders);
  }

  const show = await fetchShow(id);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  addToCache(cacheKey, show);

  const mappedMedia = mapMediaDetailsToMedia(
    show,
    configuration,
    watchProviders
  );

  logger.profile(`getShow #${id}`);

  return mappedMedia;
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
