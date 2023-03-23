export const secrets = {
  MOVIE_DB_API_KEY: process.env.MOVIE_DB_API_KEY ?? "",
};

export const db = {
  DATABASE_NAME: process.env.DATABASE_NAME ?? "",
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING ?? "",
};

export const url = {
  TMDB_URL: process.env.TMDB_URL ?? "",
};
