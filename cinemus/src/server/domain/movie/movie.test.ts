import { it, expect, describe, vi } from "vitest";
import { type Media } from "../media";
import { getMovie, searchMovies } from "./movie";
import * as tmdb from "../../../src/api/tmdb";
import { getImages } from "../image";
import { buildStubConfiguration } from "../../../test";
import { clearCache } from "../../db/upstash/cache";

vi.mock("../../db/upstash/cache", () => {
  let data: any = {};

  const addToCache = (key: string, value: any): void => {
    data[key] = value;
  };

  const retrieveFromCache = (key: string): any => {
    return data[key];
  };

  const clearCache = (): void => {
    data = {};
  };

  return {
    addToCache,
    retrieveFromCache,
    clearCache,
  };
});

describe("movie domain", () => {
  const configuration = buildStubConfiguration();

  describe("getMovie", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "getMovie");
      const expectedMovie: Media = {
        __type: "movie",
        title: "Stub Movie",
        genres: ["Horror", "Comedy"],
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getMovie("12345");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toEqual(expectedMovie);
    });

    it("hits API and gets watch providers if not in cache and region is specified", async () => {
      // Reset cache
      await clearCache();

      const apiSpy = vi.spyOn(tmdb, "getMovie");
      const expectedMovie: Media = {
        __type: "movie",
        genres: ["Horror", "Comedy"],
        title: "Stub Movie",
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
      const result = await getMovie("12345", "AU");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toEqual(expectedMovie);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getMovie");
      const expectedMovie: Media = {
        __type: "movie",
        title: "Stub Movie",
        genres: ["Horror", "Comedy"],
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getMovie("12345");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedMovie);
    });

    it("retrieves from cache with watch providers if it exists and region is specified", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedMovie: Media = {
        __type: "movie",
        title: "Stub Movie",
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
        genres: ["Horror", "Comedy"],
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
      const result = await getMovie("12345", "AU");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedMovie);
    });
  });

  describe("searchMovies", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "searchMovies");
      const expectedMovies: Media[] = [
        {
          __type: "movie",
          title: "Stub Movie Two",
          genres: [],
          id: 22222,
          images: getImages("/posterPath.jpg", configuration),
        },
        {
          __type: "movie",
          title: "Stub Movie Three",
          genres: [],
          id: 33333,
          images: getImages("/posterPath.jpg", configuration),
        },
        {
          __type: "movie",
          title: "Stub Movie One",
          genres: [],
          id: 11111,
          images: getImages("/posterPath.jpg", configuration),
        },
      ];
      const result = await searchMovies("Stub");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toEqual(expectedMovies);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getMovie");
      const expectedMovies: Media[] = [
        {
          __type: "movie",
          title: "Stub Movie Two",
          genres: [],
          id: 22222,
          images: getImages("/posterPath.jpg", configuration),
        },
        {
          __type: "movie",
          title: "Stub Movie Three",
          genres: [],
          id: 33333,
          images: getImages("/posterPath.jpg", configuration),
        },
        {
          __type: "movie",
          title: "Stub Movie One",
          genres: [],
          id: 11111,
          images: getImages("/posterPath.jpg", configuration),
        },
      ];
      const result = await searchMovies("Stub");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedMovies);
    });
  });
});
