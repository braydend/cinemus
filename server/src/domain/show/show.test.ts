import { it, expect, describe, vi } from "vitest";
import { type Media } from "../media";
import { getShow, searchShows } from "./show";
import * as tmdb from "../../../src/api/tmdb";
import { getImages } from "../image";
import { buildStubConfiguration, dropAllCollections } from "../../../test";

describe("show domain", () => {
  const configuration = buildStubConfiguration();

  describe("getShow", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShow: Media = {
        __type: "show",
        title: "Stub Show",
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getShow("12345");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toEqual(expectedShow);
    });

    it("hits API and gets watch providers if not in cache and region is specified", async () => {
      // Reset cache
      await dropAllCollections();

      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShow: Media = {
        __type: "show",
        title: "Stub Show",
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
        watchProviders: [
          {
            region: "AU",
            flatrate: [
              {
                logoUrl: "https://image.tmdb.org/t/p/original/netflix.jpg",
                name: "Netflix",
              },
            ],
          },
        ],
      };
      const result = await getShow("12345", "AU");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toEqual(expectedShow);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShow: Media = {
        __type: "show",
        title: "Stub Show",
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getShow("12345");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedShow);
    });

    it("retrieves from cache with watch providers if it exists and region is specified", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShow: Media = {
        __type: "show",
        title: "Stub Show",
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
        watchProviders: [
          {
            region: "AU",
            flatrate: [
              {
                logoUrl: "https://image.tmdb.org/t/p/original/netflix.jpg",
                name: "Netflix",
              },
            ],
          },
        ],
      };
      const result = await getShow("12345", "AU");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedShow);
    });
  });

  describe("searchShows", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "searchShows");
      const expectedShows: Media[] = [
        {
          __type: "show",
          title: "Stub Show Two",
          images: getImages("/posterPath.jpg", configuration),
          id: 22222,
        },
        {
          __type: "show",
          title: "Stub Show Three",
          images: getImages("/posterPath.jpg", configuration),
          id: 33333,
        },
        {
          __type: "show",
          title: "Stub Show One",
          images: getImages("/posterPath.jpg", configuration),
          id: 11111,
        },
      ];
      const result = await searchShows("Stub");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toEqual(expectedShows);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShows: Media[] = [
        {
          __type: "show",
          title: "Stub Show Two",
          images: getImages("/posterPath.jpg", configuration),
          id: 22222,
        },
        {
          __type: "show",
          title: "Stub Show Three",
          images: getImages("/posterPath.jpg", configuration),
          id: 33333,
        },
        {
          __type: "show",
          title: "Stub Show One",
          images: getImages("/posterPath.jpg", configuration),
          id: 11111,
        },
      ];
      const result = await searchShows("Stub");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedShows);
    });
  });
});
