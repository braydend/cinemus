import { hydrateMovie } from "../movie";
import { hydrateShow } from "../show";
import { logger } from "../../libs/logger";
import { type MediaType } from "../../../types";
import db, { list, listMember, media, user } from "../../db/prisma";
import { UserError } from "../../../errors";
import { sortMediaAlphabetically } from "../../../utils/sort";
import { mapListMember } from "../listMember";
import { getUserPreferences } from "../userPreferences";

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

  const mappedList = {
    ...list,
    owner: { ...list.owner, role: "owner" },
    members: list.members.map(mapListMember),
  };

  logger.profile(`getListData #${listId}`);

  return mappedList;
};

const checkEditMediaAccess = async (userId: string, listId: string) => {
  const list = await getListData(listId);

  const listMember = list.members.find(({ id }) => id === userId);

  const hasPermission =
    listMember?.role === "COLLABORATOR" || listMember?.role === "MODERATOR";

  if (!hasPermission && list.ownerId !== userId) {
    throw new UserError({
      code: "UNAUTHORIZED",
      message: `Insufficient permissions to edit this list.`,
    });
  }
};

const checkEditDataAccess = async (userId: string, listId: string) => {
  const list = await getListData(listId);

  const listMember = list.members.find(({ id }) => id === userId);

  const hasPermission = listMember?.role === "MODERATOR";

  const isOwner = list.ownerId === userId;

  if (hasPermission || isOwner) return;

  throw new UserError({
    code: "UNAUTHORIZED",
    message: `Insufficient permissions to edit this list.`,
  });
};

const checkCreateAccess = async (userId: string) => {
  const [userData, lists] = await Promise.all([
    user.getUserById(userId),
    list.getListsForUser(userId),
  ]);
  const isAdmin = userData.role === "ADMIN";
  const hasExceededListLimit = lists.ownedLists.length >= 2;

  if (!hasExceededListLimit) return;

  if (!isAdmin) {
    throw new UserError({
      code: "UNAUTHORIZED",
      message: `Insufficient permissions to create a list.`,
    });
  }

  throw new UserError({
    code: "BAD_REQUEST",
    message: `You've created too many lists.`,
  });
};

const checkDeleteAccess = async (userId: string, listId: string) => {
  const [userData, list] = await Promise.all([
    user.getUserById(userId),
    getListData(listId),
  ]);

  const listMember = list.members.find(({ id }) => id === userId);

  const isAdmin = userData.role !== "ADMIN";
  const isListOwner = list.ownerId === userId;

  const hasPermission = listMember?.role === "MODERATOR";

  if (isAdmin || isListOwner || hasPermission) return;

  throw new UserError({
    code: "UNAUTHORIZED",
    message: `Insufficient permissions to delete this list.`,
  });
};

export const updateListData = async (
  listId: string,
  updateData: {
    name: string;
    members: { id: string; role: "VIEWER" | "COLLABORATOR" | "MODERATOR" }[];
  },
  userId: string
) => {
  logger.profile(
    `updateListData #${listId} (data: ${JSON.stringify(updateData)})`
  );

  await checkEditDataAccess(userId, listId);

  const [updatedList] = await Promise.all([
    list.updateListById(
      listId,
      { name: updateData.name },
      {
        members: true,
        owner: true,
      }
    ),
    updateData.members.map((memberData) =>
      listMember.updateListMember(listId, memberData.id, memberData.role)
    ),
  ]);

  logger.profile(
    `updateListData #${listId} (data: ${JSON.stringify(updateData)})`
  );

  return updatedList;
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
        ? hydrateMovie(media, region)
        : hydrateShow(media, region)
    )
  );

  const mappedMedia = hydratedData.map((media) => ({
    ...media,
    isWatched:
      list.media.find(({ id }) => id === media.id.toString())?.isWatched ??
      false,
  }));

  const sortedMedia = mappedMedia.sort(sortMediaAlphabetically);

  logger.profile(`getListMedia #${listId}`);

  return { media: sortedMedia };
};

export const getListsForUser = async (userId: string) => {
  logger.profile(`getListsForUser #${userId}`);

  const lists = await db.getListsForUser(userId);

  console.log("lists", lists);

  const mappedLists = [
    ...lists.ownedLists.map(({ ...listData }) => ({
      ...listData,
      role: "owner",
      owner: { ...listData.owner, role: "owner" },
      members: listData.members.map(mapListMember),
    })),
    ...lists.joinedLists.map(({ ...listData }) => ({
      ...listData,
      role:
        listData.members.find(({ user: { id } }) => userId === id)?.role ??
        "member",
      owner: { ...listData.owner, role: "owner" },
      members: listData.members.map(mapListMember),
    })),
  ];

  logger.profile(`getListsForUser #${userId}`);

  return mappedLists;
};

export const updateListMedia = async (
  media: ListedMedia,
  listId: string,
  userId: string,
  region?: string
) => {
  logger.profile(`updateList #${listId} data=${JSON.stringify(media)}`);

  await checkEditMediaAccess(userId, listId);

  const list = await db.addMediaToList(media, listId);

  const hydratedResults = await Promise.all(
    list.media.map((media) =>
      media.type === "movie"
        ? hydrateMovie(media, region)
        : hydrateShow(media, region)
    )
  );

  const sortedMedia = hydratedResults.sort(sortMediaAlphabetically);

  logger.profile(`updateList #${listId} media:${JSON.stringify(media)}`);

  return sortedMedia;
};

export const removeMediaFromList = async (
  media: { id: string; __type: MediaType },
  listId: string,
  userId: string,
  region?: string
) => {
  logger.profile(`removeFromList #${listId} data=${JSON.stringify(media)}`);

  await checkEditMediaAccess(userId, listId);

  const list = await db.removeMediaFromList(media, listId);

  const hydratedResults = await Promise.all(
    list.media.map((media) =>
      media.type === "movie"
        ? hydrateMovie(media, region)
        : hydrateShow(media, region)
    )
  );

  const sortedMedia = hydratedResults.sort(sortMediaAlphabetically);

  logger.profile(`removeFromList #${listId} media=${JSON.stringify(media)}`);

  return sortedMedia;
};

export const addMediaToList = async (
  userId: string,
  mediaData: { id: string; __type: MediaType },
  listId: string
) => {
  logger.profile(`addMediaToList (list: #${listId}, mediaId:${mediaData.id})`);

  await checkEditMediaAccess(userId, listId);

  const [createdMedia, userPreferences] = await Promise.all([
    media.addMediaToList(listId, mediaData.id, mediaData.__type),
    getUserPreferences(userId),
  ]);

  const newMedia =
    mediaData.__type === "movie"
      ? await hydrateMovie(
          createdMedia,
          userPreferences?.watchProviderRegion ?? undefined
        )
      : await hydrateShow(
          createdMedia,
          userPreferences?.watchProviderRegion ?? undefined
        );

  logger.profile(`addMediaToList (list: #${listId}, mediaId:${mediaData.id})`);

  return newMedia;
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

export const removeMemberFromList = async (
  listId: string,
  userToRemove: string,
  userId: string
) => {
  logger.profile(
    `removeMemberFromList (listId #${listId} userId #${userToRemove})`
  );

  await checkEditDataAccess(userId, listId);

  const updatedList = await list.removeListMember(listId, userToRemove);

  logger.profile(
    `removeMemberFromList (listId #${listId} userId #${userToRemove})`
  );

  return updatedList;
};
