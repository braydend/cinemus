import {
  type TmdbConfigurationResponse,
  type TmdbMovie,
  type TmdbShow,
  type TmdbShowWatchProviderResponse,
} from "../api";
import { getImages, type Images } from "./image";
import {
  mapResponseToWatchProvider,
  type WatchProvider,
} from "./watchProviders";

// TODO: remove this and replace with common typing
export interface Media {
  id: number;
  title: string;
  images: Images;
  __type: "movie" | "show";
  isWatched?: boolean;
  watchProviders?: WatchProvider[];
}

export type MediaList = Array<Omit<Media, "watchProviders">>;

export const mapApiResponseToMediaWithWatchProviders = (
  response: TmdbMovie | TmdbShow,
  configuration: TmdbConfigurationResponse,
  watchProviders: TmdbShowWatchProviderResponse
): Media => {
  const media = mapApiResponseToMedia(response, configuration);

  return {
    ...media,
    watchProviders: mapResponseToWatchProvider(watchProviders, configuration),
  };
};

export const mapApiResponseToMedia = (
  response: TmdbMovie | TmdbShow,
  configuration: TmdbConfigurationResponse
): Omit<Media, "watchProviders"> => {
  const isMovie = response.__type === "movie";
  const images = getImages(response.poster_path, configuration);

  return {
    id: response.id,
    title: isMovie ? response.title : response.name,
    images,
    __type: response.__type,
  };
};

export const mapApiResponseToMediaList = (
  response: TmdbMovie[] | TmdbShow[],
  configuration: TmdbConfigurationResponse
): MediaList => {
  return response.map((res) => mapApiResponseToMedia(res, configuration));
};
