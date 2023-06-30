import { prisma } from "~/server/db";
import { ServerError } from "../../../errors";

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