import {
  type TmdbConfigurationResponse,
  type TmdbMovie,
  type TmdbShow,
  type TmdbShowWatchProviderResponse,
  type TmdbWatchProviderRegionsResponse,
} from "../../../src/api/tmdb";

export const buildStubShow = (
  customData?: Partial<Omit<TmdbShow, "__type">>
): TmdbShow => {
  const defaultData: TmdbShow = {
    __type: "show",
    name: "Stub Show",
    id: 12345,
    backdrop_path: "www.foo.bar",
    first_air_date: "mockdate",
    genre_ids: [1, 2, 3],
    origin_country: ["mockcountry"],
    original_language: "english",
    original_name: "Stub Show",
    overview: "mock overview",
    popularity: 10,
    poster_path: "/posterPath.jpg",
    vote_average: 5,
    vote_count: 200,
  };

  return { ...defaultData, ...customData };
};

export const buildStubMovie = (
  customData?: Partial<Omit<TmdbMovie, "__type">>
): TmdbMovie => {
  const defaultData: TmdbMovie = {
    __type: "movie",
    title: "Stub Movie",
    id: 12345,
    backdrop_path: "www.foo.bar",
    genre_ids: [1, 2, 3],
    original_language: "english",
    original_title: "Stub Movie",
    overview: "mock overview",
    popularity: 10,
    poster_path: "/posterPath.jpg",
    vote_average: 5,
    vote_count: 200,
    adult: false,
    release_date: "mockdate",
    video: true,
  };

  return { ...defaultData, ...customData };
};

export const buildStubConfiguration = (): TmdbConfigurationResponse => {
  const imageSizes = ["w100", "w300", "w500", "w700", "w1000", "original"];

  return {
    images: {
      base_url: "http://image.tmdb.org/t/p/",
      secure_base_url: "https://image.tmdb.org/t/p/",
      backdrop_sizes: imageSizes,
      logo_sizes: imageSizes,
      poster_sizes: imageSizes,
      profile_sizes: imageSizes,
      still_sizes: imageSizes,
    },
    change_keys: [],
  };
};

export const buildStubWatchProviderRegions =
  (): TmdbWatchProviderRegionsResponse => {
    return {
      results: [
        {
          english_name: "Australia",
          native_name: "Australia",
          iso_3166_1: "AU",
        },
        {
          english_name: "Italy",
          native_name: "Italia",
          iso_3166_1: "IT",
        },
        {
          english_name: "New Zealand",
          native_name: "New Zealand",
          iso_3166_1: "NZ",
        },
      ],
    };
  };

export const buildStubShowWatchProviders = (
  id: number
): TmdbShowWatchProviderResponse => {
  return {
    id,
    results: {
      AU: {
        flatrate: [
          {
            provider_name: "Netflix",
            provider_id: 1,
            logo_path: "/netflix.jpg",
            display_priority: 1,
          },
        ],
        link: "www.netflix.com",
      },
      NZ: {
        flatrate: [
          {
            provider_name: "Paramount Plus",
            provider_id: 1,
            logo_path: "/paramount.jpg",
            display_priority: 1,
          },
        ],
        link: "www.paramountplus.com",
      },
    },
  };
};
