import { retrieveOne } from "../db/mongodb/retrieveOne";
import { upsert } from "../db/mongodb/upsert";
import { type Media } from "./media";
import { getMovie } from "./movie";
import { getShow } from "./show";

interface ListedMedia {
  id: string;
  __type: "movie" | "show";
  isWatched: boolean;
}

export interface List {
  userId: string;
  media: ListedMedia[];
}

export const getList = async (userId: string): Promise<Media[]> => {
  const data = await retrieveOne<List>("lists", { userId });

  if (data === null) {
    return [];
  }

  const hydratedData = await Promise.all(
    data.media.map(async (media) => ({
      ...(media.__type === "movie"
        ? await getMovie(media.id)
        : await getShow(media.id)),
      isWatched: media.isWatched ?? false,
    }))
  );

  return hydratedData;
};

export const updateList = async (
  data: List,
  userId: string
): Promise<Media[]> => {
  const result = await upsert<List>("lists", data, { userId });

  const hydratedResults = await Promise.all(
    result.media.map(async (media) => ({
      ...(media.__type === "movie"
        ? await getMovie(media.id)
        : await getShow(media.id)),
      isWatched: media.isWatched ?? false,
    }))
  );

  return hydratedResults;
};
