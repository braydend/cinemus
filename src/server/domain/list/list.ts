import { type Media } from "../media";
import { getMovie } from "../movie";
import { getShow } from "../show";
import { logger } from "../../libs/logger";
import { type MediaType } from "../../../types";
import {
  getListDataForOwner,
  removeMediaFromListDataForOwner,
  addMediaToListDataForOwner,
  addNamesToLists,
} from "../../db/prisma";

interface ListedMedia {
  id: string;
  __type: "movie" | "show";
  isWatched?: boolean;
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

  const list = await getListDataForOwner(userId);
  await addNamesToLists();

  const hydratedData = await Promise.all(
    list.media.map(async (media) => ({
      ...(media.type === "movie"
        ? await getMovie(media.id, region)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`getList #${userId}`);

  return hydratedData;
};

export const updateList = async (
  media: ListedMedia,
  userId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`updateList #${userId} data=${JSON.stringify(media)}`);

  const list = await addMediaToListDataForOwner(media, userId);

  const hydratedResults = await Promise.all(
    list.media.map(async (media) => ({
      ...(media.type === "movie"
        ? await getMovie(media.id, region)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`updateList #${userId} media:${JSON.stringify(media)}`);

  return hydratedResults;
};

export const removeFromList = async (
  media: { id: string; __type: MediaType },
  userId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`removeFromList #${userId} data=${JSON.stringify(media)}`);

  const list = await removeMediaFromListDataForOwner(media, userId);

  const hydratedResults = await Promise.all(
    list.media.map(async (media) => ({
      ...(media.type === "movie"
        ? await getMovie(media.id, region)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`removeFromList #${userId} media=${JSON.stringify(media)}`);

  return hydratedResults;
};
