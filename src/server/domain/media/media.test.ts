import {
  type TmdbMovieDetails,
  type TmdbShowDetails,
} from "~/server/externalApi";
import { type Media, mapMediaDetailsToMedia } from "./media";
import {
  buildStubConfiguration,
  buildStubMovie,
  buildStubShow,
} from "~/../test/mocks/tmdb";
import { dropAllCollections } from "~/../test/utils/db";
import { getImages } from "../image";
import { describe, it, afterAll, expect } from "vitest";

describe("media domain", () => {
  afterAll(async () => {
    await dropAllCollections();
  });
  describe("mapApiResponseToMedia", () => {
    const configuration = buildStubConfiguration();

    it("correctly maps show to media", () => {
      const input: TmdbShowDetails = buildStubShow();
      const expected: Media = {
        __type: "show",
        id: 12345,
        title: "Stub Show",
        genres: ["Horror", "Comedy"],
        images: getImages("/posterPath.jpg", configuration),
      };

      expect(mapMediaDetailsToMedia(input, configuration)).toEqual(expected);
    });

    it("correctly maps movie to media", () => {
      const input: TmdbMovieDetails = buildStubMovie();
      const expected: Media = {
        __type: "movie",
        id: 12345,
        title: "Stub Movie",
        genres: ["Horror", "Comedy"],
        images: getImages("/posterPath.jpg", configuration),
      };

      expect(mapMediaDetailsToMedia(input, configuration)).toEqual(expected);
    });
  });
});
