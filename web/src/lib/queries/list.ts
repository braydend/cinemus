import {endpoints} from "../config";

type SearchType = "movie" | "show"

export type MediaResponse = {
    Id: string,
    Name: string
};

const buildUrl = (type: SearchType, query: string) => {
    const endpoint = type === "movie" ? "findMovie" : "findShow"

    return `${endpoints.lambdaBase}/${endpoint}?query=${query}`
};

const search = async (query: string, authToken: string, mediaType: SearchType): Promise<MediaResponse> => {
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

export const searchShow = (query: string, authToken: string) => search(query, authToken, "show")
export const searchMovie = (query: string, authToken: string) => search(query, authToken, "movie")