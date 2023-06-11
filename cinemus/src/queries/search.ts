import { endpoints } from "../utils/config";
import { type Media } from "../types";

type SearchType = "movie" | "show";

export type MediaResponse = Pick<
  Media,
  "id" | "title" | "__type" | "images" | "isWatched"
>;

interface SearchResults {
  results: Media[];
}

const buildUrl = (type: SearchType, query: string): string => {
  const endpoint = type === "movie" ? "searchMovies" : "searchShows";

  return `${endpoints.lambdaBase}/${endpoint}?query=${query}`;
};

const search = async (
  query: string,
  mediaType: SearchType
): Promise<SearchResults> => {
  const response = await fetch(buildUrl(mediaType, query), {
    method: "GET",
  });

  if (response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  }

  throw Error(await response.text());
};

export const searchShows = async (query: string): Promise<SearchResults> =>
  await search(query, "show");
export const searchMovies = async (query: string): Promise<SearchResults> =>
  await search(query, "movie");
