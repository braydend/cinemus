import { rest } from "msw";
import { url } from "~/server/config";
import {
  buildStubConfiguration,
  buildStubMovie,
  buildStubShow,
  buildStubWatchProviders,
  buildStubWatchProviderRegions,
  buildStubShowSearch,
  buildStubMovieSearch,
} from "../mocks/tmdb";

export const handlers = [
  rest.get(`${url.TMDB_URL}/movie/:id`, (req, res, ctx) => {
    const movie = buildStubMovie();

    return res(ctx.status(200), ctx.json(movie));
  }),

  rest.get(`${url.TMDB_URL}/search/movie`, (req, res, ctx) => {
    const movies = [
      buildStubMovieSearch({
        title: "Stub Movie One",
        original_title: "Stub Movie One",
        id: 11111,
        popularity: 50,
      }),
      buildStubMovieSearch({
        title: "Stub Movie Two",
        id: 22222,
        original_title: "Stub Movie Two",
        popularity: 150,
      }),
      buildStubMovieSearch({
        title: "Stub Movie Three",
        id: 33333,
        original_title: "Stub Movie Three",
        popularity: 100,
      }),
    ];

    return res(
      ctx.status(200),
      ctx.json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: movies,
      })
    );
  }),

  rest.get(`${url.TMDB_URL}/tv/:id`, (req, res, ctx) => {
    const show = buildStubShow();

    return res(ctx.status(200), ctx.json(show));
  }),

  rest.get(`${url.TMDB_URL}/search/tv`, (req, res, ctx) => {
    const shows = [
      buildStubShowSearch({
        name: "Stub Show One",
        original_name: "Stub Show One",
        id: 11111,
        popularity: 50,
      }),
      buildStubShowSearch({
        name: "Stub Show Two",
        id: 22222,
        original_name: "Stub Show Two",
        popularity: 150,
      }),
      buildStubShowSearch({
        name: "Stub Show Three",
        id: 33333,
        original_name: "Stub Show Three",
        popularity: 100,
      }),
    ];

    return res(
      ctx.status(200),
      ctx.json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: shows,
      })
    );
  }),

  rest.get(`${url.TMDB_URL}/configuration`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(buildStubConfiguration()));
  }),

  rest.get(`${url.TMDB_URL}/watch/providers/regions`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(buildStubWatchProviderRegions()));
  }),

  rest.get(`${url.TMDB_URL}/tv/:id/watch/providers`, (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json(buildStubWatchProviders(Number(id))));
  }),

  rest.get(`${url.TMDB_URL}/movie/:id/watch/providers`, (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json(buildStubWatchProviders(Number(id))));
  }),
];
