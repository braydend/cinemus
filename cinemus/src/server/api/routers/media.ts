import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUserPreferences } from "../../domain/userPreferences";
import { getMovie, searchMovies } from "../../domain/movie";
import { getShow, searchShows } from "../../domain/show";

export const mediaRouter = createTRPCRouter({
  getMedia: protectedProcedure
    .input(z.object({ type: z.enum(["show", "movie"]), id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = (ctx.session.user["sub"] as string).split("|")[1] ?? "";
      const prefs = await getUserPreferences(userId);
      const isMovie = input.type === "movie";
      const id = input.id.toString(10);
      if (isMovie) {
        return await getMovie(id, prefs.watchProviderRegion);
      }
      return await getShow(id, prefs.watchProviderRegion);
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
});
