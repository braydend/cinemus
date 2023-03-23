import { type TmdbMovie, type TmdbShow } from "../api/tmdb";
import { type Media, mapApiResponseToMedia } from "./media";
import { buildStubMovie, buildStubShow, dropAllCollections } from "../../test";

describe("media domain", () => {
  afterAll(async () => {
    await dropAllCollections();
  });
  describe("mapApiResponseToMedia", () => {
    it("correctly maps show to media", () => {
      const input: TmdbShow = buildStubShow();
      const expected: Media = {
        __type: "show",
        id: 12345,
        title: "Stub Show",
      };

      expect(mapApiResponseToMedia(input)).toEqual(expected);
    });

    it("correctly maps movie to media", () => {
      const input: TmdbMovie = buildStubMovie();
      const expected: Media = {
        __type: "movie",
        id: 12345,
        title: "Stub Movie",
      };

      expect(mapApiResponseToMedia(input)).toEqual(expected);
    });
  });
});
