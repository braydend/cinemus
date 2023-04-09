import { type TmdbMovie, type TmdbShow } from "../api";
import { getImages, type Images } from "./image";

// TODO: remove this and replace with common typing
export interface Media {
  id: number;
  title: string;
  images: Images;
  __type: "movie" | "show";
  isWatched?: boolean;
}

export const mapApiResponseToMedia = async (
  response: TmdbMovie | TmdbShow
): Promise<Media> => {
  const isMovie = response.__type === "movie";
  const images = await getImages(response.poster_path);

  return {
    id: response.id,
    title: isMovie ? response.title : response.name,
    images,
    __type: response.__type,
  };
};
