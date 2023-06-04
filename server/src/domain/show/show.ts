import {
  getShow as fetchShow,
  searchShows as searchShowRequest,
  type TmdbShow,
} from "../../api/tmdb";
import { logger } from "../../libs/logger";
import {
  mapApiResponseToMedia,
  mapApiResponseToMediaList,
  type Media,
  type MediaList,
} from "../media";
import { getConfiguration } from "../configuration";
import { getShowWatchProviders } from "../watchProviders";
import { addToCache, retrieveFromCache } from "../../db/upstash/cache";

export const getShow = async (id: string, region?: string): Promise<Media> => {
  logger.profile(`getShow #${id}`);
  const cacheKey = `show-${id}`;
  const cachedShow = await retrieveFromCache<TmdbShow>(cacheKey);
  const configuration = await getConfiguration();
  const watchProviders =
    region != null
      ? await getShowWatchProviders(id, configuration, region)
      : undefined;

  if (cachedShow != null) {
    return mapApiResponseToMedia(cachedShow, configuration, watchProviders);
  }

  const show = await fetchShow(id);
  addToCache(cacheKey, show);

  const mappedMedia = mapApiResponseToMedia(
    show,
    configuration,
    watchProviders
  );

  logger.profile(`getShow #${id}`);

  return mappedMedia;
};

export const searchShows = async (query: string): Promise<MediaList> => {
  logger.profile(`searchShows: ${query}`);
  const { results } = await searchShowRequest(query);
  const configuration = await getConfiguration();

  for (const show of results) {
    const cacheKey = `show-${show.id.toString(10)}`;
    // Don't await caching of data returned from API
    addToCache(cacheKey, show);
  }

  const mappedMedia = mapApiResponseToMediaList(results, configuration);
  logger.profile(`searchShows: ${query}`);

  return mappedMedia;
};
