import {
  getMovie as fetchMovie,
  searchMovies as searchMovieRequest,
  type TmdbMovie,
} from "../../api/tmdb";
import { addToCache, retrieveFromCache } from "../../db/mongodb/cache";
import { mapApiResponseToMedia, type Media } from "../media";
import { getConfiguration } from "../configuration";
import { getMovieWatchProviders } from "../watchProviders";

export const getMovie = async (id: string, region?: string): Promise<Media> => {
  const cachedMovie = await retrieveFromCache<TmdbMovie>(id, {
    "data.__type": "movie",
  });
  const configuration = await getConfiguration();
  const watchProviders =
    region != null
      ? await getMovieWatchProviders(id, configuration, region)
      : undefined;
  if (cachedMovie != null) {
    return mapApiResponseToMedia(
      cachedMovie.data,
      configuration,
      watchProviders
    );
  }

  const movie = await fetchMovie(id);
  addToCache(id, movie);

  return mapApiResponseToMedia(movie, configuration, watchProviders);
};

export const searchMovies = async (query: string): Promise<Media[]> => {
  const { results } = await searchMovieRequest(query);
  const configuration = await getConfiguration();

  for (const movie of results) {
    // Don't await caching of data returned from API
    addToCache(movie.id.toString(10), movie);
  }

  return results.map((media) => mapApiResponseToMedia(media, configuration));
};
