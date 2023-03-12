import {getShow as fetchShow, searchShows as searchShowRequest, TmdbShow} from "../api/tmdb"
import {addToCache, retrieveFromCache} from "../db/mongodb/cache";
import {mapApiResponseToMedia} from "./media";

export const getShow = async (id: string) => {
    const cachedShow = await retrieveFromCache<TmdbShow>("show", id)
    if (cachedShow) {
        return mapApiResponseToMedia(cachedShow.data)
    }

    const movie = await fetchShow(id)
    addToCache("show", id, movie)

    return mapApiResponseToMedia(movie)
}

export const searchShows = async (query: string) => {
    const { results } = await searchShowRequest(query)
    for (const movie of results) {
        // Don't await caching of data returned from API
        addToCache("show", movie.id.toString(10), movie)
    }

    return results.map(mapApiResponseToMedia)
};