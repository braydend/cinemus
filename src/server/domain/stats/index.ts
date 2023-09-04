import media from "../../db/prisma/media";

export const getMostPopularShow = async () => {
  return await media.getMostPopularShow();
};
