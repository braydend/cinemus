import { rest } from "msw";
import { url } from "../../src/config";
import { buildStubMovie } from "../api";
import { mapApiResponseToMedia } from "../../src/domain/media";

export const handlers = [
  // Handles a POST /login request
  rest.get(`${url.TMDB_URL}/movie/:id`, (req, res, ctx) => {
    const movie = buildStubMovie();

    return res(
      // Respond with a 200 status code

      //   ctx.status(200),
      ctx.json(movie)
    );
  }),
];
