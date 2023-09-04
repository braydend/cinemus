import { Prisma } from "@prisma/client";
import { prisma } from "../../db";
import { UserError } from "../../../errors";

const addMediaToList = async (
  listId: string,
  mediaId: string,
  mediaType: string
) => {
  try {
    return await prisma.media.create({
      data: { id: mediaId, type: mediaType, listId },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new UserError({
          code: "BAD_REQUEST",
          message: "This already exists in the list.",
        });
      }
    }
    throw e;
  }
};

const getMostPopularShow = async () => {
  const count = await prisma.media.groupBy({
    by: ["id"],
    where: { type: "show" },
    _count: { listId: true },
  });

  console.table(count);

  return await prisma.media.findFirst({ where: { type: "show" } });
};

const prismaMediaFunctions = {
  addMediaToList,
  getMostPopularShow,
};

export default prismaMediaFunctions;
