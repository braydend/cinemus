import { list } from "./schema";
import { logger } from "../../libs/logger";
import { db } from "./connection";
import { eq } from "drizzle-orm";

const getListsForUser = async (userId: string) => {
  logger.profile(`getListsForUser drizzle db call #${userId}`);

  // const [ownedLists, joinedLists] = await Promise.all([
  const result = await db.query.list.findMany({
    where: eq(list.ownerId, userId),
    with: {
      media: true,
      owner: true,
    },
  });

  //   const [ownedLists, joinedLists] = await Promise.all([
  //     prisma.list.findMany({
  //       where: { ownerId: userId },
  //       include: {
  //         media: true,
  //         members: { include: { user: true } },
  //         owner: true,
  //       },
  //     }),
  //     prisma.list.findMany({
  //       where: { members: { some: { userId } } },
  //       include: {
  //         media: true,
  //         members: { include: { user: true } },
  //         owner: true,
  //       },
  //     }),
  //   ]);

  logger.profile(`getListsForUser drizzle db call #${userId}`);

  //   return { ownedLists, joinedLists };
};

const drizzleListQueries = { getListsForUser };

export default drizzleListQueries;
