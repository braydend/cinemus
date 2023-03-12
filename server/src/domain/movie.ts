import {getMovie as fetchMovie, searchMovies as searchMovieRequest, TmdbMovie} from "../api/tmdb"
import {addToCache, retrieveFromCache} from "../db/mongodb/cache";
import {mapApiResponseToMedia} from "./media";

export const getMovie = async (id: string) => {
    const cachedMovie = await retrieveFromCache<TmdbMovie>("movie", id)
    if (cachedMovie) {
        return mapApiResponseToMedia(cachedMovie.data)
    }

    const movie = await fetchMovie(id)
    addToCache("movie", id, movie)

    return mapApiResponseToMedia(movie)
}

export const searchMovies = async (query: string) => {
    const { results } = await searchMovieRequest(query)
    for (const movie of results) {
        // Don't await caching of data returned from API
        addToCache("movie", movie.id.toString(10), movie)
    }

    return results.map(mapApiResponseToMedia)
};