import axios from "axios";
import { secrets, url } from "../../config";

const tmdbBaseUrl = url.TMDB_URL;

export interface TmdbConfigurationResponse {
  images: Images;
  change_keys: string[];
}

export interface Images {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export const getConfiguration =
  async (): Promise<TmdbConfigurationResponse> => {
    try {
      const response = await axios.get<TmdbConfigurationResponse>(
        `${tmdbBaseUrl}/configuration?api_key=${secrets.MOVIE_DB_API_KEY}`
      );

      return response.data;
    } catch (e) {
      throw Error(`Failed to get TMDB configuration: ${(e as Error).message}`);
    }
  };
