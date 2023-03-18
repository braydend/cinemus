import { TmdbMovie, TmdbShow } from "../../../src/api/tmdb";

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
    poster_path: "www.foo.bar",
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
    poster_path: "www.foo.bar",
    vote_average: 5,
    vote_count: 200,
    adult: false,
    release_date: "mockdate",
    video: true,
  };

  return { ...defaultData, ...customData };
};
