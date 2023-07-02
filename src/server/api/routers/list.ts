import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getListData,
  getListsForUser,
  joinList,
  removeMediaFromList,
  updateListMedia,
  getListMedia,
  createList,
} from "../../domain/list";
import { getUserPreferences } from "../../domain/userPreferences";

const getListByIdInput = z.string();
const acceptInvitationInput = z.string();
const updateListInput = z.object({
  listId: z.string(),
  media: z.object({
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
  }),
});

const removeFromListInput = z.object({
  listId: z.string(),
  media: z.object({
    __type: z.enum(["movie", "show"]),
    id: z.string(),
  }),
});

export const listRouter = createTRPCRouter({
  acceptInvitation: protectedProcedure
    .input(acceptInvitationInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await joinList(input, userId);
    }),
  getListData: protectedProcedure
    .input(getListByIdInput)
    .query(async ({ input }) => {
      return await getListData(input);
    }),
  getListMedia: protectedProcedure
    .input(getListByIdInput)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const prefs = await getUserPreferences(userId);
      return await getListMedia(input, prefs.watchProviderRegion ?? undefined);
    }),
  getListsForUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await getListsForUser(userId);
  }),
  createList: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await createList(userId);
  }),
  updateListMedia: protectedProcedure
    .input(updateListInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prefs = await getUserPreferences(userId);
      const { listId, media } = input;

      return await updateListMedia(
        media,
        listId,
        prefs.watchProviderRegion ?? undefined
      );
    }),
  removeMediaFromList: protectedProcedure
    .input(removeFromListInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const prefs = await getUserPreferences(userId);
      const { listId, media } = input;

      return await removeMediaFromList(
        media,
        listId,
        prefs.watchProviderRegion ?? undefined
      );
    }),
});
