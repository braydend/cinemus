import {
  getMovie as fetchMovie,
  searchMovies as searchMovieRequest,
  type TmdbMovieDetails,
} from "../../api/tmdb";
import {
  mapMediaDetailsToMedia,
  mapSearchResponseToMedia,
  type Media,
} from "../media";

import { getConfiguration } from "../configuration";
import { getMovieWatchProviders } from "../watchProviders";
import { addToCache, retrieveFromCache } from "../../db/upstash/cache";

export const getMovie = async (id: string, region?: string): Promise<Media> => {
  const cacheKey = `movie-${id}`;
  const cachedMovie = await retrieveFromCache<TmdbMovieDetails>(cacheKey);
  const configuration = await getConfiguration();
  const watchProviders =
    region != null
      ? await getMovieWatchProviders(id, configuration, region)
      : undefined;
  if (cachedMovie != null) {
    return mapMediaDetailsToMedia(cachedMovie, configuration, watchProviders);
  }

  const movie = await fetchMovie(id);
  addToCache(cacheKey, movie);

  return mapMediaDetailsToMedia(movie, configuration, watchProviders);
};

export const searchMovies = async (query: string): Promise<Media[]> => {
  const { results } = await searchMovieRequest(query);
  const configuration = await getConfiguration();

  // for (const movie of results) {
  // const cacheKey = `show-${movie.id.toString(10)}`;
  // Don't await caching of data returned from API
  // TODO: Search results aren't being cached since the shape is different to the "get" result
  // addToCache(cacheKey, movie);
  // }

  return results.map((media) => mapSearchResponseToMedia(media, configuration));
};
