import { it, expect, describe, vi } from "vitest";
import { type Media } from "../media";
import { getMovie, searchMovies } from "./movie";
import * as tmdb from "../../../src/api/tmdb";
import { getImages } from "../image";
import { buildStubConfiguration, dropAllCollections } from "../../../test";

describe("movie domain", () => {
  const configuration = buildStubConfiguration();

  describe("getMovie", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "getMovie");
      const expectedMovie: Media = {
        __type: "movie",
        title: "Stub Movie",
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getMovie("12345");

      expect(apiSpy).toHaveBeenCalledOnce();
      expect(result).toEqual(expectedMovie);
    });

    it("hits API and gets watch providers if not in cache and region is specified", async () => {
      // Reset cache
      await dropAllCollections();

      const apiSpy = vi.spyOn(tmdb, "getMovie");
      const expectedShow: Media = {
        __type: "movie",
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
      expect(result).toEqual(expectedShow);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getMovie");
      const expectedMovie: Media = {
        __type: "movie",
        title: "Stub Movie",
        images: getImages("/posterPath.jpg", configuration),
        id: 12345,
      };
      const result = await getMovie("12345");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedMovie);
    });

    it("retrieves from cache with watch providers if it exists and region is specified", async () => {
      const apiSpy = vi.spyOn(tmdb, "getShow");
      const expectedShow: Media = {
        __type: "movie",
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

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedShow);
    });
  });

  describe("searchMovies", () => {
    it("hits API if not in cache", async () => {
      const apiSpy = vi.spyOn(tmdb, "searchMovies");
      const expectedMovies: Media[] = [
        {
          __type: "movie",
          title: "Stub Movie",
          images: getImages("/posterPath.jpg", configuration),
          id: 12345,
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
          title: "Stub Movie",
          id: 12345,
          images: getImages("/posterPath.jpg", configuration),
        },
      ];
      const result = await searchMovies("Stub");

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toEqual(expectedMovies);
    });
  });
});
