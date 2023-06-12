import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getUserPreferences,
  updateUserPreferences,
} from "../../domain/userPreferences";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserPreferences: protectedProcedure.query(async ({ ctx }) => {
    const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
    return await getUserPreferences(userId);
  }),
  setUserPreferences: protectedProcedure
    .input(
      z.object({
        watchProviderRegion: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
      return await updateUserPreferences(userId, input);
    }),
});
