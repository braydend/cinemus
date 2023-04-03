import { describe, expect, it } from "vitest";
import { getImages } from "./image";

describe("image domain", () => {
  it("returns a correctly constructed image map", async () => {
    const result = await getImages("foo");

    // TODO: Assert sizes are named correctly
    expect(result).toEqual({});
  });
});
