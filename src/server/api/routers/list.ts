import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getList, updateList } from "../../domain/list";
import { getUserPreferences } from "../../domain/userPreferences";

export const listRouter = createTRPCRouter({
  getList: protectedProcedure.query(async ({ ctx }) => {
    const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
    const prefs = await getUserPreferences(userId);
    return await getList(userId, prefs.watchProviderRegion);
  }),
  updateList: protectedProcedure
    .input(
      z.array(
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
      )
    )
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
      const prefs = await getUserPreferences(userId);

      return await updateList(
        { userId, media: input },
        userId,
        prefs.watchProviderRegion
      );
    }),
});
