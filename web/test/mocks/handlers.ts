import { rest } from "msw";
import { endpoints } from "../../src/utils/config.js";
import { type MediaResponse } from "../../src/queries/search.js";

const movies: MediaResponse[] = [
  {
    id: "11111",
    title: "The Mask",
    isWatched: false,
    images: {
      logo: {},
      backdrop: {},
      poster: {},
      profile: {},
      still: {},
    },
    __type: "movie",
  },
  {
    id: "11112",
    title: "The Matrix",
    isWatched: false,
    images: {
      logo: {},
      backdrop: {},
      poster: {},
      profile: {},
      still: {},
    },
    __type: "movie",
  },
  {
    id: "11113",
    title: "The Bourne Identity",
    isWatched: false,
    images: {
      logo: {},
      backdrop: {},
      poster: {},
      profile: {},
      still: {},
    },
    __type: "movie",
  },
];

const shows: MediaResponse[] = [
  {
    id: "22221",
    title: "The Office",
    isWatched: false,
    images: {
      logo: {},
      backdrop: {},
      poster: {},
      profile: {},
      still: {},
    },
    __type: "show",
  },
  {
    id: "22222",
    title: "The Boondocks",
    isWatched: false,
    images: {
      logo: {},
      backdrop: {},
      poster: {},
      profile: {},
      still: {},
    },
    __type: "show",
  },
  {
    id: "22223",
    title: "The Last Of Us",
    isWatched: false,
    images: {
      logo: {},
      backdrop: {},
      poster: {},
      profile: {},
      still: {},
    },
    __type: "show",
  },
];

export const handlers = [
  rest.post(
    `${endpoints.lambdaBase}/:mediaType/search?query=:query`,
    async (req, res, ctx) => {
      const { mediaType } = req.params;

      const results = mediaType === "movie" ? movies : shows;

      return await res(ctx.json(results), ctx.status(200));
    }
  ),
];
