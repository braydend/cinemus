import { it, expect, describe } from "vitest";
import { type Media } from "./media";
import { getList, type List, updateList } from "./list";
import { getImages } from "./image";

const stubList = async (
  media: List["media"],
  userId: string
): Promise<void> => {
  await updateList({ media, userId }, userId);
};

describe("list domain", () => {
  describe("getList", () => {
    it("returns empty array if user does not have a list", async () => {
      const expectedList: Media[] = [];
      const result = await getList("12345");

      expect(result).toStrictEqual(expectedList);
    });

    it("returns media array if user has a list", async () => {
      await stubList(
        [
          {
            __type: "show",
            id: "12345",
            isWatched: false,
          },
        ],
        "foo"
      );
      const expectedList: Media[] = [
        {
          __type: "show",
          title: "Stub Show",
          images: await getImages("/posterPath.jpg"),
          id: 12345,
          isWatched: false,
        },
      ];
      const result = await getList("foo");

      expect(result).toStrictEqual(expectedList);
    });
  });

  describe("updateList", () => {
    it("media is successfully added to list", async () => {
      const newData: List = {
        userId: "foo",
        media: [
          {
            __type: "show",
            id: "12345",
            isWatched: false,
          },
        ],
      };
      const expectedList: Media[] = [
        {
          __type: "show",
          title: "Stub Show",
          images: await getImages("/posterPath.jpg"),
          id: 12345,
          isWatched: false,
        },
      ];
      const result = await updateList(newData, "foo");

      expect(result).toStrictEqual(expectedList);
    });
  });
});
