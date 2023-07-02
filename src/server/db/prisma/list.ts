import { prisma } from "~/server/db";
import { ServerError } from "../../../errors";

interface UpdateMediaInput {
  id: string;
  __type: "movie" | "show";
  isWatched?: boolean;
}

export const addMediaToList = async (
  media: UpdateMediaInput,
  listId: string
) => {
  // const list = await getListById(ownerId);

  const updatedList = await prisma.list.update({
    where: { id: listId },
    include: { media: true },
    data: {
      media: {
        upsert: {
          where: {
            id_type_listId: {
              id: media.id,
              listId,
              type: media.__type,
            },
          },
          create: {
            id: media.id,
            type: media.__type,
            isWatched: media.isWatched,
          },
          update: { isWatched: media.isWatched },
        },
      },
    },
  });

  return updatedList;
};

export const removeMediaFromList = async (
  media: UpdateMediaInput,
  listId: string
) => {
  // const list = await findListForOwner(ownerId);

  const updatedList = await prisma.list.update({
    where: { id: listId },
    include: { media: true },
    data: {
      media: {
        delete: {
          id_type_listId: {
            id: media.id,
            type: media.__type,
            listId,
          },
        },
      },
    },
  });

  return updatedList;
};

// TODO: Remove
export const getListDataForId = async (listId: string) => {
  const list = await findListById(listId, {
    media: true,
    members: true,
    owner: true,
  });

  return list;
};

export const addUserToList = async (listId: string, userId: string) => {
  return await prisma.listMember.upsert({
    create: { userId, listId },
    update: { userId, listId },
    where: { userId_listId: { listId, userId } },
  });
};

export const getListById = async (
  listId: string,
  joins?: { media?: boolean; members?: boolean; owner?: boolean }
) => {
  return prisma.list.findUnique({
    where: { id: listId },
    include: {
      media: joins?.media,
      members: { include: { user: joins?.members } },
      owner: joins?.owner,
    },
  });
};

export const getListDataForOwner = async (ownerId: string) => {
  const list = await findListForOwner(ownerId);

  return list;
};

const getListsForUser = async (userId: string) => {
  const ownedLists = await prisma.list.findMany({
    where: { ownerId: userId },
    include: { media: true, members: { include: { user: true } }, owner: true },
  });

  const joinedLists = await prisma.list.findMany({
    where: { members: { some: { userId } } },
    include: { media: true, members: { include: { user: true } }, owner: true },
  });

  return { ownedLists, joinedLists };
};

export default {
  getListsForUser,
  getListDataForId,
  getListDataForOwner,
  addMediaToList,
  addUserToList,
  removeMediaFromList,
  getListById,
};

const findListById = async (
  listId: string,
  joins: { media?: boolean; members?: boolean; owner?: boolean }
) => {
  const { media, members: includeMembers, owner } = joins;
  return await prisma.list.findFirst({
    where: { id: listId },
    include: { media, members: { include: { user: includeMembers } }, owner },
  });
};

const findListForOwner = async (userId: string) => {
  const list = await prisma.list.findFirst({
    where: { ownerId: userId },
    include: { media: true },
  });

  if (list) {
    return list;
  }

  // TODO: move the following to a list creation method instead

  const owner = await prisma.user.findUnique({ where: { id: userId } });

  if (!owner) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to find user",
    });
  }

  const name = owner.name
    ? `${owner.name}'s list`
    : owner.email
    ? `${owner.email}'s list`
    : "New List";

  return await prisma.list.create({
    data: { ownerId: userId, name },
    include: { media: true },
  });
};
