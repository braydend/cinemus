import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getMostPopularShow } from "../../domain/stats";

export const statsRouter = createTRPCRouter({
  getMostPopularShow: publicProcedure.query(async () => {
    return await getMostPopularShow();
  }),
});
