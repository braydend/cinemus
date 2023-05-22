import {
  type TmdbConfigurationResponse,
  type TmdbWatchProviderResponse,
  type TmdbWatchProviderRegionsResponse,
  TmdbShowDetails,
  TmdbMovieDetails,
  TmdbSearchShowResult,
  TmdbSearchMovieResult,
} from "../../../src/api/tmdb";

export const buildStubShow = (
  customData?: Partial<Omit<TmdbShowDetails, "__type">>
): TmdbShowDetails => {
  const defaultData: TmdbShowDetails = {
    __type: "show",
    name: "Stub Show",
    id: 12345,
    backdrop_path: "www.foo.bar",
    first_air_date: "mockdate",
    genres: [
      {
        id: 1,
        name: "Horror",
      },
      { id: 2, name: "Comedy" },
    ],
    origin_country: ["mockcountry"],
    original_language: "english",
    original_name: "Stub Show",
    overview: "mock overview",
    popularity: 10,
    poster_path: "/posterPath.jpg",
    vote_average: 5,
    vote_count: 200,
    adult: false,
    created_by: [],
    episode_run_time: [],
    homepage: "",
    in_production: false,
    languages: [],
    last_air_date: "",
    last_episode_to_air: {
      air_date: "",
      episode_number: 1,
      id: 1,
      name: "",
      overview: "",
      production_code: "",
      runtime: null,
      season_number: 1,
      show_id: 1,
      still_path: null,
      vote_average: 1,
      vote_count: 1,
    },
    networks: [],
    next_episode_to_air: null,
    number_of_episodes: 1,
    number_of_seasons: 1,
    production_companies: [],
    production_countries: [],
    seasons: [],
    spoken_languages: [],
    status: "",
    tagline: "",
    type: "",
  };

  return { ...defaultData, ...customData };
};

export const buildStubShowSearch = (
  customData?: Partial<Omit<TmdbSearchShowResult, "__type">>
): TmdbSearchShowResult => {
  const defaultData: TmdbSearchShowResult = {
    __type: "show",
    name: "Stub Show",
    id: 12345,
    backdrop_path: "www.foo.bar",
    first_air_date: "mockdate",
    genre_ids: [1, 2],
    origin_country: ["mockcountry"],
    original_language: "english",
    original_name: "Stub Show",
    overview: "mock overview",
    popularity: 10,
    poster_path: "/posterPath.jpg",
    vote_average: 5,
    vote_count: 200,
    adult: false,
  };

  return { ...defaultData, ...customData };
};

export const buildStubMovie = (
  customData?: Partial<Omit<TmdbMovieDetails, "__type">>
): TmdbMovieDetails => {
  const defaultData: TmdbMovieDetails = {
    __type: "movie",
    title: "Stub Movie",
    id: 12345,
    backdrop_path: "www.foo.bar",
    genres: [
      {
        id: 1,
        name: "Horror",
      },
      { id: 2, name: "Comedy" },
    ],
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
    belongs_to_collection: {
      backdrop_path: "",
      id: 1,
      name: "",
      poster_path: "",
    },
    budget: 1,
    homepage: "",
    imdb_id: "",
    production_companies: [],
    production_countries: [],
    revenue: 1,
    runtime: 1,
    spoken_languages: [],
    status: "",
    tagline: "",
  };

  return { ...defaultData, ...customData };
};

export const buildStubMovieSearch = (
  customData?: Partial<Omit<TmdbSearchMovieResult, "__type">>
): TmdbSearchMovieResult => {
  const defaultData: TmdbSearchMovieResult = {
    __type: "movie",
    title: "Stub Movie",
    id: 12345,
    backdrop_path: "www.foo.bar",
    genre_ids: [1, 2],
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

export const buildStubWatchProviders = (
  id: number
): TmdbWatchProviderResponse => {
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
