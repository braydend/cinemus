import { it, expect, describe } from "vitest";
import { type Media } from "../media";
import { getList, type List, updateList } from "./list";
import { getImages } from "../image";
import { buildStubConfiguration } from "../../../test";

const stubList = async (
  media: List["media"],
  userId: string
): Promise<void> => {
  await updateList({ media, userId }, userId);
};

describe("list domain", () => {
  const configuration = buildStubConfiguration();

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
          images: getImages("/posterPath.jpg", configuration),
          id: 12345,
          isWatched: false,
        },
      ];
      const result = await getList("foo");

      expect(result).toEqual(expectedList);
    });

    it("returns media array with watch providers if user has a list and region is provided", async () => {
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
          images: getImages("/posterPath.jpg", configuration),
          id: 12345,
          isWatched: false,
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
        },
      ];
      const result = await getList("foo", "AU");

      expect(result).toEqual(expectedList);
    });
  });

  describe("updateList", () => {
    describe("media is successfully added to list", async () => {
      it("does not include watch providers if region is omitted", async () => {
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
            images: getImages("/posterPath.jpg", configuration),
            id: 12345,
            isWatched: false,
          },
        ];
        const result = await updateList(newData, "foo");

        expect(result).toEqual(expectedList);
      });

      it("includes watch providers if region is provided", async () => {
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
            images: getImages("/posterPath.jpg", configuration),
            id: 12345,
            isWatched: false,
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
          },
        ];
        const result = await updateList(newData, "foo", "AU");

        expect(result).toEqual(expectedList);
      });
    });
  });
});
