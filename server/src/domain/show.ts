import {
  getShow as fetchShow,
  searchShows as searchShowRequest,
  type TmdbShow,
} from "../api/tmdb";
import { addToCache, retrieveFromCache } from "../db/mongodb/cache";
import { mapApiResponseToMedia, type Media } from "./media";

export const getShow = async (id: string): Promise<Media> => {
  const cachedShow = await retrieveFromCache<TmdbShow>(id, {
    "data.__type": "show",
  });
  if (cachedShow != null) {
    return await mapApiResponseToMedia(cachedShow.data);
  }

  console.log(`Cache miss for show #${id}`);

  const movie = await fetchShow(id);
  addToCache(id, movie);

  return await mapApiResponseToMedia(movie);
};

export const searchShows = async (query: string): Promise<Media[]> => {
  const { results } = await searchShowRequest(query);
  for (const show of results) {
    // Don't await caching of data returned from API
    addToCache(show.id.toString(10), show);
  }

  return await Promise.all(results.map(mapApiResponseToMedia));
};
