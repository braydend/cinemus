import {
  getMovie as fetchMovie,
  searchMovies as searchMovieRequest,
  type TmdbMovieDetails,
} from "~/server/externalApi/tmdb";
import {
  mapMediaDetailsToMedia,
  mapSearchResponseToMedia,
  type MediaResponse,
} from "../media";

import { getConfiguration } from "../configuration";
import { getMovieWatchProviders } from "../watchProviders";
import { addToCache, retrieveFromCache } from "../../db/upstash/cache";
import { type Media } from "@prisma/client";

export const hydrateMovie = async (movie: Media, region?: string) => {
  const cacheKey = `movie-${movie.id}`;
  const [cachedMovie, configuration] = await Promise.all([
    retrieveFromCache<TmdbMovieDetails>(cacheKey),
    getConfiguration(),
  ]);
  const watchProviders =
    region != null
      ? await getMovieWatchProviders(movie.id, configuration, region)
      : undefined;
  if (cachedMovie != null) {
    return mapMediaDetailsToMedia(cachedMovie, configuration, watchProviders);
  }

  const fetchedMovie = await fetchMovie(movie.id);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  addToCache(cacheKey, fetchedMovie);

  return {
    ...mapMediaDetailsToMedia(fetchedMovie, configuration, watchProviders),
    isWatched: movie.isWatched,
  };
};

export const searchMovies = async (query: string): Promise<MediaResponse[]> => {
  const [{ results }, configuration] = await Promise.all([
    searchMovieRequest(query),
    getConfiguration(),
  ]);

  // for (const movie of results) {
  // const cacheKey = `show-${movie.id.toString(10)}`;
  // Don't await caching of data returned from API
  // TODO: Search results aren't being cached since the shape is different to the "get" result
  // addToCache(cacheKey, movie);
  // }

  return results.map((media) => mapSearchResponseToMedia(media, configuration));
};
