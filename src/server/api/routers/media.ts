import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUserPreferences } from "../../domain/userPreferences";
import { getMovie, searchMovies } from "../../domain/movie";
import { getShow, searchShows } from "../../domain/show";
import { getWatchProviderRegions } from "../../domain/watchProviders";

export const mediaRouter = createTRPCRouter({
  getMedia: protectedProcedure
    .input(z.object({ type: z.enum(["show", "movie"]), id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prefs = await getUserPreferences(userId);
      const isMovie = input.type === "movie";
      const id = input.id.toString(10);
      if (isMovie) {
        return await getMovie(id, prefs.watchProviderRegion ?? undefined);
      }
      return await getShow(id, prefs.watchProviderRegion ?? undefined);
    }),
  searchMedia: protectedProcedure
    .input(z.object({ type: z.enum(["show", "movie"]), query: z.string() }))
    .query(async ({ input: { query, type } }) => {
      const isMovie = type === "movie";

      if (isMovie) {
        return await searchMovies(query);
      }
      return await searchShows(query);
    }),
  getWatchProviderRegions: protectedProcedure.query(async () => {
    return await getWatchProviderRegions();
  }),
});
