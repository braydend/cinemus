import {
  getShow as fetchShow,
  searchShows as searchShowRequest,
  type TmdbShow,
} from "../api/tmdb";
import { addToCache, retrieveFromCache } from "../db/mongodb/cache";
import { logger } from "../libs/logger";
import { mapApiResponseToMedia, type Media } from "./media";

export const getShow = async (id: string): Promise<Media> => {
  logger.profile(`getShow #${id}`);
  const cachedShow = await retrieveFromCache<TmdbShow>(id, {
    "data.__type": "show",
  });
  if (cachedShow != null) {
    return await mapApiResponseToMedia(cachedShow.data);
  }

  const movie = await fetchShow(id);
  addToCache(id, movie);

  const mappedMedia = await mapApiResponseToMedia(movie);

  logger.profile(`getShow #${id}`);

  return mappedMedia;
};

export const searchShows = async (query: string): Promise<Media[]> => {
  logger.profile(`searchShows: ${query}`);
  const { results } = await searchShowRequest(query);
  for (const show of results) {
    // Don't await caching of data returned from API
    addToCache(show.id.toString(10), show);
  }

  const mappedMedia = await Promise.all(results.map(mapApiResponseToMedia));
  logger.profile(`searchShows: ${query}`);

  return mappedMedia;
};
