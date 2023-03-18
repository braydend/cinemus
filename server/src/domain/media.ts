import { type TmdbMovie, type TmdbShow } from "../api/tmdb";

export interface Media {
  id: number;
  title: string;
  __type: "movie" | "show";
}

export const mapApiResponseToMedia = (
  response: TmdbMovie | TmdbShow
): Media => {
  const isMovie = response.__type === "movie";

  return {
    id: response.id,
    title: isMovie ? response.title : response.name,
    __type: response.__type,
  };
};
