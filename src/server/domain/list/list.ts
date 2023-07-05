import { type Media } from "../media";
import { getMovie } from "../movie";
import { getShow } from "../show";
import { logger } from "../../libs/logger";
import { type MediaType } from "../../../types";
import db, { user } from "../../db/prisma";
import { UserError } from "../../../errors";
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

const checkEditAccess = async (userId: string, listId: string) => {
  const list = await getListData(listId);
  if (list.ownerId !== userId) {
    throw new UserError({
      code: "UNAUTHORIZED",
      message: `Insufficient permissions to edit this list.`,
    });
  }
};

const checkCreateAccess = async (userId: string) => {
  const userData = await user.getUserById(userId);
  //TODO: Change this to allow for 2 owned lists (or one? not sure yet)
  if (userData.role !== "ADMIN") {
    throw new UserError({
      code: "UNAUTHORIZED",
      message: `Insufficient permissions to create a list.`,
    });
  }
};

const checkDeleteAccess = async (userId: string, listId: string) => {
  const [userData, list] = await Promise.all([
    user.getUserById(userId),
    getListData(listId),
  ]);

  const isAdmin = userData.role !== "ADMIN";
  const isListOwner = list.ownerId === userId;

  if (!isAdmin && !isListOwner) {
    throw new UserError({
      code: "UNAUTHORIZED",
      message: `Insufficient permissions to delete this list.`,
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

  await checkEditAccess(userId, listId);

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

  await checkCreateAccess(userId);

  const list = await db.createList(userId);

  logger.profile(`createList (userId #${userId})`);

  return list;
};

export const deleteList = async (userId: string, listId: string) => {
  logger.profile(`deleteList (listId #${listId})`);

  await checkDeleteAccess(userId, listId);

  const list = await db.deleteList(listId);

  logger.profile(`deleteList (listId #${listId})`);

  return list;
};
