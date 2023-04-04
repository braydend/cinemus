import { type TmdbMovie, type TmdbShow } from "../api";
import { type Media, mapApiResponseToMedia } from "./media";
import { buildStubMovie, buildStubShow, dropAllCollections } from "../../test";
import { getImages } from "./image";

describe("media domain", () => {
  afterAll(async () => {
    await dropAllCollections();
  });
  describe("mapApiResponseToMedia", () => {
    it("correctly maps show to media", async () => {
      const input: TmdbShow = buildStubShow();
      const expected: Media = {
        __type: "show",
        id: 12345,
        title: "Stub Show",
        images: await getImages("/posterPath.jpg"),
      };

      expect(await mapApiResponseToMedia(input)).toEqual(expected);
    });

    it("correctly maps movie to media", async () => {
      const input: TmdbMovie = buildStubMovie();
      const expected: Media = {
        __type: "movie",
        id: 12345,
        title: "Stub Movie",
        images: await getImages("/posterPath.jpg"),
      };

      expect(await mapApiResponseToMedia(input)).toEqual(expected);
    });
  });
});
