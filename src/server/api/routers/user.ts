import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  getUserPreferences,
  updateUserPreferences,
} from "../../domain/userPreferences";
import { z } from "zod";
import { getAllUsers } from "../../domain/user";

export const userRouter = createTRPCRouter({
  getUserPreferences: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await getUserPreferences(userId);
  }),
  setUserPreferences: protectedProcedure
    .input(
      z.object({
        watchProviderRegion: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await updateUserPreferences(userId, input);
    }),
  getAllUsers: adminProcedure.query(async () => {
    return await getAllUsers();
  }),
});
