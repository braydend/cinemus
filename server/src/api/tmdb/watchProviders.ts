import axios from "axios";
import { secrets, url } from "../../config";

const tmdbBaseUrl = url.TMDB_URL;

export interface TmdbWatchProviderRegionsResponse {
  results: TmdbWatchProviderRegion[];
}

export interface TmdbWatchProviderRegion {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export const getWatchProviderRegions =
  async (): Promise<TmdbWatchProviderRegionsResponse> => {
    try {
      const response = await axios.get<TmdbWatchProviderRegionsResponse>(
        `${tmdbBaseUrl}/watch/providers/regions?api_key=${secrets.MOVIE_DB_API_KEY}`
      );

      return response.data;
    } catch (e) {
      throw Error(
        `Failed to get TMDB watch providers: ${(e as Error).message}`
      );
    }
  };
