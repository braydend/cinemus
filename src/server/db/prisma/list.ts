import { prisma } from "~/server/db";

interface UpdateMediaInput {
  id: string;
  __type: "movie" | "show";
  isWatched?: boolean;
}

export const addMediaToListDataForOwner = async (
  media: UpdateMediaInput,
  ownerId: string
) => {
  const list = await findListForOwner(ownerId);

  const updatedList = await prisma.list.update({
    where: { id: list.id },
    include: { media: true },
    data: {
      media: {
        upsert: {
          where: {
            id_type_listId: {
              id: media.id,
              listId: list.id,
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

export const removeMediaFromListDataForOwner = async (
  media: UpdateMediaInput,
  ownerId: string
) => {
  const list = await findListForOwner(ownerId);

  const updatedList = await prisma.list.update({
    where: { id: list.id },
    include: { media: true },
    data: {
      media: {
        delete: {
          id_type_listId: {
            id: media.id,
            type: media.__type,
            listId: list.id,
          },
        },
      },
    },
  });

  return updatedList;
};

export const getListDataForOwner = async (ownerId: string) => {
  const list = await findListForOwner(ownerId);

  return list;
};

//TODO: remove
export const addNamesToLists = async () => {
  const lists = await prisma.list.findMany({ include: { owner: true } });

  for (const list of lists) {
    if (!list.name) {
      const name = list.owner.name
        ? `${list.owner.name}'s list`
        : list.owner.email
        ? `${list.owner.email}'s list`
        : list.id;
      await prisma.list.update({
        where: { id: list.id },
        data: {
          name,
        },
      });
    }
  }
};

const findListForOwner = async (userId: string) => {
  const list = await prisma.list.findFirst({
    where: { ownerId: userId },
    include: { media: true },
  });

  if (list) {
    return list;
  }
  return await prisma.list.create({
    data: { ownerId: userId },
    include: { media: true },
  });
};
