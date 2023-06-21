import { type Media } from "../media";
import { getMovie } from "../movie";
import { getShow } from "../show";
import { logger } from "../../libs/logger";
import { type MediaType } from "../../../types";
import db, {
  addUserToList,
  getListDataForId,
  getListDataForOwner,
  removeMediaFromList,
  addMediaToList,
} from "../../db/prisma";
import { ServerError, UserError } from "../../../errors";

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

export const getListData = async (listId: string, region?: string) => {
  logger.profile(`getListData #${listId}`);

  const list = await db.getListById(listId, { members: true, owner: true });

  if (!list) {
    throw new UserError({
      code: "NOT_FOUND",
      message: `Cannot find list with id #${listId}`,
    });
  }

  // const hydratedData = await Promise.all(
  //   list.media.map(async (media) => ({
  //     ...(media.type === "movie"
  //       ? await getMovie(media.id, region)
  //       : await getShow(media.id, region)),
  //     isWatched: media.isWatched ?? false,
  //   }))
  // );

  logger.profile(`getListData #${listId}`);

  return list;
};

export const getListMedia = async (listId: string, region?: string) => {
  logger.profile(`getListMedia #${listId}`);

  const list = await db.getListById(listId, { media: true });

  // if (!list) {
  //   throw new UserError({
  //     code: "NOT_FOUND",
  //     message: `Cannot find list with id #${listId}`,
  //   });
  // }

  const hydratedData = await Promise.all(
    list.media.map(async (media) => ({
      ...(media.type === "movie"
        ? await getMovie(media.id, region)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`getListMedia #${listId}`);

  return { media: hydratedData };
};

export const getListsForUser = async (userId: string) => {
  logger.profile(`getListsForUser #${userId}`);

  const lists = await db.getListsForUser(userId);

  logger.profile(`getListsForUser #${userId}`);

  return lists;
};

export const updateList = async (
  media: ListedMedia,
  listId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`updateList #${listId} data=${JSON.stringify(media)}`);

  const list = await db.addMediaToList(media, listId);

  const hydratedResults = await Promise.all(
    list.media.map(async (media) => ({
      ...(media.type === "movie"
        ? await getMovie(media.id, region)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`updateList #${listId} media:${JSON.stringify(media)}`);

  return hydratedResults;
};

export const removeFromList = async (
  media: { id: string; __type: MediaType },
  listId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`removeFromList #${listId} data=${JSON.stringify(media)}`);

  const list = await db.removeMediaFromList(media, listId);

  const hydratedResults = await Promise.all(
    list.media.map(async (media) => ({
      ...(media.type === "movie"
        ? await getMovie(media.id, region)
        : await getShow(media.id, region)),
      isWatched: media.isWatched ?? false,
    }))
  );

  logger.profile(`removeFromList #${listId} media=${JSON.stringify(media)}`);

  return hydratedResults;
};
