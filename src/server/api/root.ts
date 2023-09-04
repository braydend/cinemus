import { createTRPCRouter } from "~/server/api/trpc";
import { listRouter } from "./routers/list";
import { mediaRouter } from "./routers/media";
import { userRouter } from "./routers/user";
import { statsRouter } from "./routers/stats";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  listRouter: listRouter,
  mediaRouter: mediaRouter,
  userRouter: userRouter,
  statsRouter: statsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
