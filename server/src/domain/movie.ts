import {
  getMovie as fetchMovie,
  searchMovies as searchMovieRequest,
  type TmdbMovie,
} from "../api/tmdb";
import { addToCache, retrieveFromCache } from "../db/mongodb/cache";
import { mapApiResponseToMedia, type Media } from "./media";

export const getMovie = async (id: string): Promise<Media> => {
  const cachedMovie = await retrieveFromCache<TmdbMovie>(id, {
    "data.__type": "movie",
  });
  if (cachedMovie != null) {
    return await mapApiResponseToMedia(cachedMovie.data);
  }

  const movie = await fetchMovie(id);
  addToCache(id, movie);

  return await mapApiResponseToMedia(movie);
};

export const searchMovies = async (query: string): Promise<Media[]> => {
  const { results } = await searchMovieRequest(query);
  for (const movie of results) {
    // Don't await caching of data returned from API
    addToCache(movie.id.toString(10), movie);
  }

  return await Promise.all(results.map(mapApiResponseToMedia));
};
