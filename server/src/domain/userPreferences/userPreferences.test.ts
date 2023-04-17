import { describe, expect, it } from "vitest";
import { getUserPreferences, updateUserPreferences } from "./userPreferences";

describe("userPreferences", () => {
  describe("getUserPreferences()", () => {
    it("returns empty userPreferences if none are stored", async () => {
      const result = await getUserPreferences("noPrefs");

      expect(result).toStrictEqual({ watchProviderRegion: undefined });
    });
  });

  describe("updateUserPreferences()", () => {
    it("updates userPreferences with provided key and value", async () => {
      const updateResult = await updateUserPreferences("updatedPrefs", {
        watchProviderRegion: "NZ",
      });
      const getResult = await getUserPreferences("updatedPrefs");

      expect(updateResult).toStrictEqual({ watchProviderRegion: "NZ" });
      expect(getResult).toStrictEqual({ watchProviderRegion: "NZ" });
    });
  });
});
