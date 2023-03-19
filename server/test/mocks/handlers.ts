import { rest } from "msw";
import { url } from "../../src/config";
import { buildStubMovie, buildStubShow } from "../api";
import { mapApiResponseToMedia } from "../../src/domain/media";

export const handlers = [
  // Handles a POST /login request
  rest.get(`${url.TMDB_URL}/movie/:id`, (req, res, ctx) => {
    const movie = buildStubMovie();

    return res(ctx.status(200), ctx.json(movie));
  }),

  rest.get(`${url.TMDB_URL}/search/movie`, (req, res, ctx) => {
    const movie = buildStubMovie();

    return res(
      ctx.status(200),
      ctx.json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [movie],
      })
    );
  }),

  rest.get(`${url.TMDB_URL}/tv/:id`, (req, res, ctx) => {
    const show = buildStubShow();

    return res(ctx.status(200), ctx.json(show));
  }),

  rest.get(`${url.TMDB_URL}/search/tv`, (req, res, ctx) => {
    const show = buildStubShow();

    return res(
      ctx.status(200),
      ctx.json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [show],
      })
    );
  }),
];
