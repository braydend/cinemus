import { rest } from "msw";
import { url } from "../../src/config";
import {
    buildStubConfiguration,
    buildStubMovie,
    buildStubShow,
    buildStubWatchProviders,
    buildStubWatchProviderRegions
} from "../api";

export const handlers = [
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

    rest.get(`${url.TMDB_URL}/configuration`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(buildStubConfiguration())
        );
    }),

    rest.get(`${url.TMDB_URL}/watch/providers/regions`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(buildStubWatchProviderRegions())
        );
    }),

    rest.get(`${url.TMDB_URL}/tv/:id/watch/providers`, (req, res, ctx) => {
        const {id} = req.params
        return res(
            ctx.status(200),
            ctx.json(buildStubWatchProviders(Number(id)))
        );
    }),

    rest.get(`${url.TMDB_URL}/movie/:id/watch/providers`, (req, res, ctx) => {
        const {id} = req.params
        return res(
            ctx.status(200),
            ctx.json(buildStubWatchProviders(Number(id)))
        );
    }),
];
