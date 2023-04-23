import { it, expect, describe, vi } from "vitest";
import { type Media } from "./media";
import { getMovie, searchMovies } from "./movie";
import * as tmdb from "../../src/api/tmdb";
import { getImages } from "./image";
import { buildStubConfiguration } from "../../test";

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
