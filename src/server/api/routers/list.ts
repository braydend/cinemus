import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getList,
  getListById,
  joinList,
  removeFromList,
  updateList,
} from "../../domain/list";
import { getUserPreferences } from "../../domain/userPreferences";
import { getUserDetails } from "../../domain/user";

export const listRouter = createTRPCRouter({
  getListById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
      const prefs = await getUserPreferences(userId);
      return await getListById(input, prefs.watchProviderRegion ?? undefined);
    }),
  test: protectedProcedure.query(async ({ ctx }) => {
    const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
    // const prefs = await getUserPreferences(userId);
    await getUserDetails(userId, ctx.session.accessToken ?? "");
  }),
  acceptInvitation: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
      // const prefs = await getUserPreferences(userId);
      return await joinList(input, userId);
    }),
  getList: protectedProcedure.query(async ({ ctx }) => {
    const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
    const prefs = await getUserPreferences(userId);
    return await getList(userId, prefs.watchProviderRegion ?? undefined);
  }),
  updateList: protectedProcedure
    .input(
      // z.array(
      z.object({
        id: z.string(),
        __type: z.enum(["movie", "show"]),
        isWatched: z.boolean().optional(),
        title: z.string(),
        genres: z.string().array(),
        watchProviders: z
          .object({
            region: z.string(),
            flatrate: z
              .object({
                name: z.string(),
                logoUrl: z.string(),
              })
              .array()
              .optional(),
            buy: z
              .object({
                name: z.string(),
                logoUrl: z.string(),
              })
              .array()
              .optional(),
            ads: z
              .object({
                name: z.string(),
                logoUrl: z.string(),
              })
              .array()
              .optional(),
            rent: z
              .object({
                name: z.string(),
                logoUrl: z.string(),
              })
              .array()
              .optional(),
            free: z
              .object({
                name: z.string(),
                logoUrl: z.string(),
              })
              .array()
              .optional(),
          })
          .array()
          .optional(),
        images: z.object({
          backdrop: z.record(z.string()),
          logo: z.record(z.string()),
          poster: z.record(z.string()),
          profile: z.record(z.string()),
          still: z.record(z.string()),
        }),
      })
      // )
    )
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
      const prefs = await getUserPreferences(userId);

      return await updateList(
        input,
        userId,
        prefs.watchProviderRegion ?? undefined
      );
    }),
  removeFromList: protectedProcedure
    .input(
      z.object({
        __type: z.enum(["movie", "show"]),
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
      const prefs = await getUserPreferences(userId);

      return await removeFromList(
        input,
        userId,
        prefs.watchProviderRegion ?? undefined
      );
    }),
});
