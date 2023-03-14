import {endpoints} from "../utils/config";

type SearchType = "movie" | "show"

export type MediaResponse = {
    id: string,
    title: string
    __type: "movie"|"show"
};

type SearchResults = {
    results: MediaResponse[]
};

const buildUrl = (type: SearchType, query: string) => {
    const endpoint = type === "movie" ? "searchMovies" : "searchShows"

    return `${endpoints.lambdaBase}/${endpoint}?query=${query}`
};

const search = async (query: string, authToken: string, mediaType: SearchType): Promise<SearchResults> => {
    const response = await fetch(
        buildUrl(mediaType, query),
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        }
    )

    if (response.ok) {
        return await response.json()
    }

    throw Error(await response.text())
}

export const searchShows = (query: string, authToken: string) => search(query, authToken, "show")
export const searchMovies = (query: string, authToken: string) => search(query, authToken, "movie")
