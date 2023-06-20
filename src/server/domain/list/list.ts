import { type Media } from "../media";
import { getMovie } from "../movie";
import { getShow } from "../show";
import { logger } from "../../libs/logger";
import { type MediaType } from "../../../types";
import db, {
  addUserToList,
  getListDataForId,
  getListDataForOwner,
  removeMediaFromListDataForOwner,
  addMediaToListDataForOwner,
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

export const getListById = async (listId: string, region?: string) => {
  logger.profile(`getListById #${listId}`);

  const list = await getListDataForId(listId);

  // const hydratedData = await Promise.all(
  //   (list?.media ?? []).map(async (media) => ({
  //     ...(media.type === "movie"
  //       ? await getMovie(media.id, region)
  //       : await getShow(media.id, region)),
  //     isWatched: media.isWatched ?? false,
  //   }))
  // );

  logger.profile(`getListById #${listId}`);

  return list;
};

export const joinList = async (listId: string, userId: string) => {
  logger.profile(`getListById #${listId}`);

  const list = await addUserToList(listId, userId);

  // const hydratedData = await Promise.all(
  //   (list?.media ?? []).map(async (media) => ({
  //     ...(media.type === "movie"
  //       ? await getMovie(media.id, region)
  //       : await getShow(media.id, region)),
  //     isWatched: media.isWatched ?? false,
  //   }))
  // );

  logger.profile(`getListById #${listId}`);

  return list;
};

export const getList = async (
  userId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`getList #${userId}`);

  const list = await getListDataForOwner(userId);

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

export const getListsForUser = async (userId: string) => {
  logger.profile(`getListsForUser #${userId}`);

  const lists = await db.getListsForUser(userId);

  logger.profile(`getListsForUser #${userId}`);

  return lists;
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
