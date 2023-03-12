import {getMovie as fetchMovie, searchMovies as searchMovieRequest, TmdbMovie} from "../api/tmdb"
import {addToCache, retrieveFromCache} from "../db/mongodb/cache";
import {mapApiResponseToMedia} from "./media";

export const getMovie = async (id: string) => {
    const cachedMovie = await retrieveFromCache<TmdbMovie>(id, {["data.__type"]: "movie"})
    if (cachedMovie) {
        return mapApiResponseToMedia(cachedMovie.data)
    }

    const movie = await fetchMovie(id)
    addToCache(id, movie)

    return mapApiResponseToMedia(movie)
}

export const searchMovies = async (query: string) => {
    const { results } = await searchMovieRequest(query)
    for (const movie of results) {
        // Don't await caching of data returned from API
        addToCache(movie.id.toString(10), movie)
    }

    return results.map(mapApiResponseToMedia)
};