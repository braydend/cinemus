import { TmdbMovie, TmdbShow } from "../api/tmdb";
import { Media, mapApiResponseToMedia } from "./media";
import { buildStubMovie, buildStubShow } from "../../test";

describe("media domain", () => {
  describe("mapApiResponseToMedia", () => {
    it("correctly maps show to media", () => {
      const input: TmdbShow = buildStubShow();
      const expected: Media = {
        __type: "show",
        id: 12345,
        title: "Test Show",
      };

      expect(mapApiResponseToMedia(input)).toEqual(expected);
    });

    it("correctly maps movie to media", () => {
      const input: TmdbMovie = buildStubMovie();
      const expected: Media = {
        __type: "movie",
        id: 12345,
        title: "Test Movie",
      };

      expect(mapApiResponseToMedia(input)).toEqual(expected);
    });
  });
});
