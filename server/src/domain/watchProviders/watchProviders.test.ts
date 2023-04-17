import { it, expect, describe, vi } from "vitest";
import {
  getWatchProviderRegions,
  type WatchProviderRegion,
} from "./watchProviders";
import * as tmdb from "../../api/tmdb";

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
