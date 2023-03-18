import { endpoints } from "../utils/config";

type SearchType = "movie" | "show";

export interface MediaResponse {
  id: string;
  title: string;
  __type: "movie" | "show";
}

interface SearchResults {
  results: MediaResponse[];
}

const buildUrl = (type: SearchType, query: string): string => {
  const endpoint = type === "movie" ? "searchMovies" : "searchShows";

  return `${endpoints.lambdaBase}/${endpoint}?query=${query}`;
};

const search = async (
  query: string,
  authToken: string,
  mediaType: SearchType
): Promise<SearchResults> => {
  const response = await fetch(buildUrl(mediaType, query), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};

export const searchShows = async (
  query: string,
  authToken: string
): Promise<SearchResults> => await search(query, authToken, "show");
export const searchMovies = async (
  query: string,
  authToken: string
): Promise<SearchResults> => await search(query, authToken, "movie");
