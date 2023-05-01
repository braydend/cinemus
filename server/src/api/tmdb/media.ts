import axios from "axios";
import { secrets, url } from "../../config";
import { logger } from "../../libs/logger";

type MediaCategory = "movie" | "tv";

const tmdbBaseUrl = url.TMDB_URL;

interface TmdbSearchResult<MediaType extends Media> {
  page: number;
  results: MediaType[];
  total_results: number;
  total_pages: number;
}

interface Media {
  poster_path: string;
  overview: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
}

export type TmdbMovie = Media & {
  __type: "movie";
  adult: boolean;
  release_date: string;
  original_title: string;
  title: string;
  video: boolean;
};

export type TmdbShow = Media & {
  __type: "show";
  first_air_date: string;
  origin_country: string[];
  name: string;
  original_name: string;
};

export interface SearchResponse<MediaType extends Media> {
  page: number;
  results: MediaType[];
  total_results: number;
  total_pages: number;
}

const markMediaType = <MediaType extends Media>(
  media: MediaType,
  type: MediaCategory
): MediaType => {
  const typeString = type === "tv" ? "show" : "movie";
  return { ...media, __type: typeString };
};

const markMediaTypes = <MediaType extends Media>(
  media: MediaType[],
  type: MediaCategory
): MediaType[] => {
  return media.map((data) => markMediaType(data, type));
};

const get = async <MediaType extends Media>(
  id: string,
  type: MediaCategory
): Promise<MediaType> => {
  logger.profile(`TMDB get ${type} #${id}`);
  try {
    const response = await axios.get<MediaType>(
      `${tmdbBaseUrl}/${type}/${id}?api_key=${secrets.MOVIE_DB_API_KEY}`
    );

    const markedMedia = markMediaType(response.data, type);
    logger.profile(`TMDB get ${type} #${id}`);

    return markedMedia;
  } catch (e) {
    throw Error(
      `Failed to find ${type} with id ${id}: ${(e as Error).message}`
    );
  }
};

const search = async <MediaType extends Media>(
  mediaType: MediaCategory,
  query: string
): Promise<SearchResponse<MediaType>> => {
  logger.profile(`TMDB search ${mediaType} "${query}"`);
  try {
    const response = await axios.get<SearchResponse<MediaType>>(
      `${tmdbBaseUrl}/search/${mediaType}?api_key=${secrets.MOVIE_DB_API_KEY}&query=${query}`
    );

    const markedMedia = markMediaTypes(response.data.results, mediaType);

    logger.profile(`TMDB search ${mediaType} "${query}"`);
    return {
      ...response.data,
      results: markedMedia.sort((a, b) => b.popularity - a.popularity),
    };
  } catch (e) {
    throw Error(
      `Failed to search for ${query} in ${mediaType}: ${(e as Error).message}`
    );
  }
};

export const getMovie = async (id: string): Promise<TmdbMovie> =>
  await get<TmdbMovie>(id, "movie");
export const getShow = async (id: string): Promise<TmdbShow> =>
  await get<TmdbShow>(id, "tv");

export const searchMovies = async (
  query: string
): Promise<TmdbSearchResult<TmdbMovie>> =>
  await search<TmdbMovie>("movie", query);
export const searchShows = async (
  query: string
): Promise<TmdbSearchResult<TmdbShow>> => await search<TmdbShow>("tv", query);
