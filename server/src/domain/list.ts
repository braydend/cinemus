import { retrieveOne } from "../db/mongodb/retrieveOne";
import { upsert } from "../db/mongodb/upsert";
import { type Media } from "./media";
import { getMovie } from "./movie";
import { getShow } from "./show";
import { logger } from "../libs/logger";

interface ListedMedia {
  id: string;
  __type: "movie" | "show";
  isWatched: boolean;
}

export interface List {
  userId: string;
  media: ListedMedia[];
}

export const getList = async (
  userId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`getList #${userId}`);
  const data = await retrieveOne<List>("lists", { userId });

  if (data === null) {
    return [];
  }

  const hydratedData = await Promise.all(
    data.media.map(async (media) => ({
      ...(media.__type === "movie"
        ? await getMovie(media.id)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`getList #${userId}`);

  return hydratedData;
};

export const updateList = async (
  data: List,
  userId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`updateList #${userId} data=${JSON.stringify(data)}`);
  const result = await upsert<List>("lists", data, { userId });

  const hydratedResults = await Promise.all(
    result.media.map(async (media) => ({
      ...(media.__type === "movie"
        ? await getMovie(media.id)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`updateList #${userId} data=${JSON.stringify(data)}`);

  return hydratedResults;
};
