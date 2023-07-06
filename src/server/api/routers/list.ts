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
  updateListData,
  deleteList,
} from "../../domain/list";
import { getUserPreferences } from "../../domain/userPreferences";

const watchProviderPaymentInput = z
  .object({
    name: z.string(),
    logoUrl: z.string(),
  })
  .array()
  .optional();

const getListByIdInput = z.string();

const deleteListInput = z.string();

const acceptInvitationInput = z.string();

const updateListDataInput = z.object({ listId: z.string(), name: z.string() });

const updateListMediaInput = z.object({
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
        flatrate: watchProviderPaymentInput,
        buy: watchProviderPaymentInput,
        ads: watchProviderPaymentInput,
        rent: watchProviderPaymentInput,
        free: watchProviderPaymentInput,
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
  updateListData: protectedProcedure
    .input(updateListDataInput)
    .mutation(async ({ input: { listId, ...updateData }, ctx }) => {
      const userId = ctx.session.user.id;

      return await updateListData(listId, updateData, userId);
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
  deleteList: protectedProcedure
    .input(deleteListInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await deleteList(userId, input);
    }),
  updateListMedia: protectedProcedure
    .input(updateListMediaInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prefs = await getUserPreferences(userId);
      const { listId, media } = input;

      return await updateListMedia(
        media,
        listId,
        userId,
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
        userId,
        prefs.watchProviderRegion ?? undefined
      );
    }),
});
