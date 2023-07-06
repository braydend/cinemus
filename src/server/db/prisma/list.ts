import { prisma } from "~/server/db";
import { ServerError } from "../../../errors";

interface UpdateMediaInput {
  id: string;
  __type: "movie" | "show";
  isWatched?: boolean;
}

const addMediaToList = async (media: UpdateMediaInput, listId: string) => {
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

const removeMediaFromList = async (media: UpdateMediaInput, listId: string) => {
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

const addUserToList = async (listId: string, userId: string) => {
  return await prisma.listMember.upsert({
    create: { userId, listId },
    update: { userId, listId },
    where: { userId_listId: { listId, userId } },
  });
};

const getListById = async (
  listId: string,
  joins?: { media?: boolean; members?: boolean; owner?: boolean }
) => {
  return await prisma.list.findUnique({
    where: { id: listId },
    include: {
      media: joins?.media,
      members: { include: { user: joins?.members } },
      owner: joins?.owner,
    },
  });
};

const updateListById = async (
  listId: string,
  updateData: { name: string },
  joins?: { media?: boolean; members?: boolean; owner?: boolean }
) => {
  return await prisma.list.update({
    where: { id: listId },
    data: { name: updateData.name },
    include: {
      media: joins?.media,
      members: { include: { user: joins?.members } },
      owner: joins?.owner,
    },
  });
};

const getListsForUser = async (userId: string) => {
  const [ownedLists, joinedLists] = await Promise.all([
    prisma.list.findMany({
      where: { ownerId: userId },
      include: {
        media: true,
        members: { include: { user: true } },
        owner: true,
      },
    }),
    prisma.list.findMany({
      where: { members: { some: { userId } } },
      include: {
        media: true,
        members: { include: { user: true } },
        owner: true,
      },
    }),
  ]);

  return { ownedLists, joinedLists };
};

const createList = async (userId: string) => {
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

const deleteList = async (listId: string) => {
  await prisma.media.deleteMany({ where: { listId } });
  return await prisma.list.delete({ where: { id: listId } });
};

const removeListMember = async (listId: string, userId: string) => {
  return await prisma.listMember.delete({
    where: { userId_listId: { userId, listId } },
    include: { user: true },
  });
};

const prismaListFunctions = {
  getListsForUser,
  addMediaToList,
  addUserToList,
  removeMediaFromList,
  getListById,
  createList,
  updateListById,
  deleteList,
  removeListMember,
};

export default prismaListFunctions;
