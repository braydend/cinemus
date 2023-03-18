export const secrets = {
  MOVIE_DB_API_KEY: process.env.MOVIE_DB_API_KEY ?? "",
  MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME ?? "",
  MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD ?? "",
};

export const db = {
  DATABASE_NAME: process.env.DATABASE_NAME ?? "",
};

export const url = {
  TMDB_URL: process.env.TMDB_URL ?? "",
};
