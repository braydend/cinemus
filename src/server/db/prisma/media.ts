import { prisma } from "../../db";

const addMediaToList = async (
  listId: string,
  mediaId: string,
  mediaType: string
) => {
  return await prisma.media.create({
    data: { id: mediaId, type: mediaType, listId },
  });
};

const prismaMediaFunctions = {
  addMediaToList,
};

export default prismaMediaFunctions;
