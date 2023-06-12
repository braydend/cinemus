export interface TmdbMedia {
  adult: boolean;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  backdrop_path: null | string;
  poster_path: null | string;
}

type TmdbShow = TmdbMedia & {
  __type: "show";
  origin_country: string[];
  original_name: string;
  first_air_date: string;
  name: string;
};

type TmdbMovie = TmdbMedia & {
  __type: "movie";
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
};

export type TmdbSearchMovieResult = TmdbMovie & {
  genre_ids: number[];
};

export type TmdbMovieDetails = TmdbMovie & {
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
};

interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: null | string;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export type TmdbSearchShowResult = TmdbShow & {
  genre_ids: number[];
};

export type TmdbShowDetails = TmdbShow & {
  created_by: any[];
  episode_run_time: any[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  next_episode_to_air: null;
  networks: ProductionCompany[];
  number_of_episodes: number;
  number_of_seasons: number;

  production_companies: any[];
  production_countries: any[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
};

interface LastEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: null;
  season_number: number;
  show_id: number;
  still_path: null;
}

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: null;
  season_number: number;
}

export interface TmdbSearch<
  ResultType = TmdbSearchMovieResult | TmdbSearchShowResult
> {
  page: number;
  total_pages: number;
  total_results: number;
  results: ResultType[];
}
