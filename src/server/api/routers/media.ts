import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { searchMovies } from "../../domain/movie";
import { searchShows } from "../../domain/show";
import { getWatchProviderRegions } from "../../domain/watchProviders";

export const mediaRouter = createTRPCRouter({
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
