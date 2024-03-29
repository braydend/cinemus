import { it, expect, describe, vi } from "vitest";
import {
  getWatchProviderRegions,
  type WatchProviderRegion,
} from "./watchProviders";
import * as tmdb from "~/server/externalApi/tmdb";

vi.mock("../../db/upstash/cache", () => {
  const data: any = {};

  const addToCache = (key: string, value: any): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    data[key] = value;
  };

  const retrieveFromCache = (key: string): any => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data[key];
  };

  return {
    addToCache,
    retrieveFromCache,
  };
});
describe("watch provider domain", () => {
  describe("getWatchProviderRegions", () => {
    it("hits api if not cached", async () => {
      const apiSpy = vi.spyOn(tmdb, "getWatchProviderRegions");
      const expectedList: WatchProviderRegion[] = [
        { name: "Australia", countryId: "AU" },
        { name: "Italia", countryId: "IT" },
        { name: "New Zealand", countryId: "NZ" },
      ];
      const result = await getWatchProviderRegions();

      expect(apiSpy).toHaveBeenCalled();
      expect(result).toStrictEqual(expectedList);
    });

    it("retrieves from cache if it exists", async () => {
      const apiSpy = vi.spyOn(tmdb, "getWatchProviderRegions");
      const expectedList: WatchProviderRegion[] = [
        { name: "Australia", countryId: "AU" },
        { name: "Italia", countryId: "IT" },
        { name: "New Zealand", countryId: "NZ" },
      ];
      const result = await getWatchProviderRegions();

      expect(apiSpy).not.toHaveBeenCalled();
      expect(result).toStrictEqual(expectedList);
    });
  });
});
