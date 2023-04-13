import { it, expect, describe, vi } from "vitest";
import { type Media } from "./media";
import { getShow, searchShows } from "./show";
import * as tmdb from "../../src/api/tmdb";
import { getImages } from "./image";
import { buildStubConfiguration } from "../../test";

describe("show domain", () => {
  const configuration = buildStubConfiguration();

  describe("getShow", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShow: Media = {
        __type: "show",
        title: "Stub Show",
        images: await getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getShow("12345");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toStrictEqual(expectedShow);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShow: Media = {
        __type: "show",
        title: "Stub Show",
        images: await getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getShow("12345");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toStrictEqual(expectedShow);
    });
  });

  describe("searchShows", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "searchShows");
      const expectedShows: Media[] = [
        {
          __type: "show",
          title: "Stub Show",
          images: await getImages("/posterPath.jpg", configuration),
          id: 12345,
        },
      ];
      const result = await searchShows("Stub");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toStrictEqual(expectedShows);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShows: Media[] = [
        {
          __type: "show",
          title: "Stub Show",
          images: await getImages("/posterPath.jpg", configuration),
          id: 12345,
        },
      ];
      const result = await searchShows("Stub");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toStrictEqual(expectedShows);
    });
  });
});
