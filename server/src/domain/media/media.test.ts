import { type TmdbMovie, type TmdbShow } from "../../api";
import { type Media, mapApiResponseToMedia } from "./media";
import {
  buildStubConfiguration,
  buildStubMovie,
  buildStubShow,
  dropAllCollections,
} from "../../../test";
import { getImages } from "../image";
import { describe, it, afterAll, expect } from "vitest";

describe("media domain", () => {
  afterAll(async () => {
    await dropAllCollections();
  });
  describe("mapApiResponseToMedia", () => {
    const configuration = buildStubConfiguration();

    it("correctly maps show to media", async () => {
      const input: TmdbShow = buildStubShow();
      const expected: Media = {
        __type: "show",
        id: 12345,
        title: "Stub Show",
        images: getImages("/posterPath.jpg", configuration),
      };

      expect(mapApiResponseToMedia(input, configuration)).toEqual(expected);
    });

    it("correctly maps movie to media", async () => {
      const input: TmdbMovie = buildStubMovie();
      const expected: Media = {
        __type: "movie",
        id: 12345,
        title: "Stub Movie",
        images: getImages("/posterPath.jpg", configuration),
      };

      expect(mapApiResponseToMedia(input, configuration)).toEqual(expected);
    });
  });
});
