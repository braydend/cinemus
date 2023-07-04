import { type Media } from "../media";
import { getMovie } from "../movie";
import { getShow } from "../show";
import { logger } from "../../libs/logger";
import { type MediaType } from "../../../types";
import db from "../../db/prisma";
import { UserError } from "../../../errors";
import { type List } from "@prisma/client";
import { sortMediaAlphabetically } from "../../../utils/sort";

interface ListedMedia {
  id: string;
  __type: "movie" | "show";
  isWatched?: boolean;
}

export const joinList = async (listId: string, userId: string) => {
  logger.profile(`getListById #${listId}`);

  const list = await db.getListById(listId);

  if (
    list?.ownerId === userId ||
    list?.members.map(({ userId: id }) => id).includes(userId)
  ) {
    throw new UserError({
      message: "This user already has access to the list",
      code: "BAD_REQUEST",
    });
  }
  const updatedList = await db.addUserToList(listId, userId);

  logger.profile(`getListById #${listId}`);

  return updatedList;
};

export const getListData = async (listId: string) => {
  logger.profile(`getListData #${listId}`);

  const list = await db.getListById(listId, { members: true, owner: true });

  if (!list) {
    throw new UserError({
      code: "NOT_FOUND",
      message: `Cannot find list with id #${listId}`,
    });
  }

  logger.profile(`getListData #${listId}`);

  return list;
};

const checkUserAccess = async (
  userId: string,
  listId: string,
  action: "EDIT"
) => {
  const list = await getListData(listId);
  if (action === "EDIT") checkEditAccess(userId, list);
};

const checkEditAccess = (userId: string, list: List) => {
  if (list.ownerId !== userId) {
    throw new UserError({
      code: "UNAUTHORIZED",
      message: `Cannot edit list with id #${list.id}`,
    });
  }
};

export const updateListData = async (
  listId: string,
  updateData: { name: string },
  userId: string
) => {
  logger.profile(
    `updateListData #${listId} (data: ${JSON.stringify(updateData)})`
  );

  await checkUserAccess(userId, listId, "EDIT");

  const list = await db.updateListById(listId, updateData, {
    members: true,
    owner: true,
  });

  logger.profile(
    `updateListData #${listId} (data: ${JSON.stringify(updateData)})`
  );

  return list;
};

export const getListMedia = async (listId: string, region?: string) => {
  logger.profile(`getListMedia #${listId}`);

  const list = await db.getListById(listId, { media: true });

  if (!list) {
    throw new UserError({
      code: "NOT_FOUND",
      message: `Cannot find list with id #${listId}`,
    });
  }

  const hydratedData = await Promise.all(
    list.media.map((media) =>
      media.type === "movie"
        ? getMovie(media.id, region)
        : getShow(media.id, region)
    )
  );

  const sortedMedia = hydratedData.sort(sortMediaAlphabetically);

  logger.profile(`getListMedia #${listId}`);

  return { media: sortedMedia };
};

export const getListsForUser = async (userId: string) => {
  logger.profile(`getListsForUser #${userId}`);

  const lists = await db.getListsForUser(userId);

  logger.profile(`getListsForUser #${userId}`);

  return lists;
};

export const updateListMedia = async (
  media: ListedMedia,
  listId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`updateList #${listId} data=${JSON.stringify(media)}`);

  const list = await db.addMediaToList(media, listId);

  const hydratedResults = await Promise.all(
    list.media.map((media) =>
      media.type === "movie"
        ? getMovie(media.id, region)
        : getShow(media.id, region)
    )
  );

  const sortedMedia = hydratedResults.sort(sortMediaAlphabetically);

  logger.profile(`updateList #${listId} media:${JSON.stringify(media)}`);

  return sortedMedia;
};

export const removeMediaFromList = async (
  media: { id: string; __type: MediaType },
  listId: string,
  region?: string
): Promise<Media[]> => {
  logger.profile(`removeFromList #${listId} data=${JSON.stringify(media)}`);

  const list = await db.removeMediaFromList(media, listId);

  const hydratedResults = await Promise.all(
    list.media.map((media) =>
      media.type === "movie"
        ? getMovie(media.id, region)
        : getShow(media.id, region)
    )
  );

  const sortedMedia = hydratedResults.sort(sortMediaAlphabetically);

  logger.profile(`removeFromList #${listId} media=${JSON.stringify(media)}`);

  return sortedMedia;
};

export const createList = async (userId: string) => {
  logger.profile(`createList (userId #${userId})`);

  const list = await db.createList(userId);

  logger.profile(`createList (userId #${userId})`);

  return list;
};
