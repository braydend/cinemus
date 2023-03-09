/*
var tmdbBaseUrl = "https://api.themoviedb.org/3/"
key := utils.GetEnvVar("MOVIE_DB_API_KEY")
endpoint := fmt.Sprintf("%s/search/%s?api_key=%s&query=%s", tmdbBaseUrl, mediaType, key, query)
 */
import axios from "axios"
import {secrets} from "../config";

type MediaCategory = "movie"|"tv"

const tmdbBaseUrl = "https://api.themoviedb.org/3/"

type Media = {
    poster_path: string;
    overview: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    backdrop_path: string;
    popularity: number;
    vote_count: number;
    vote_average: number;
}

export type TmdbMovie = Media & {
    __type: "movie"
    adult: boolean;
    release_date: string;
    original_title: string;
    title: string;
    video: boolean;
}

export type TmdbShow = Media & {
    __type: "show"
    first_air_date: string;
    origin_country: string[];
    name: string;
    original_name: string;
}

export interface SearchResponse<MediaType extends Media> {
    page: number;
    results: MediaType[];
    total_results: number;
    total_pages: number;
}

const markMediaTypes = <MediaType extends Media>(media: MediaType[], type: MediaCategory): MediaType[] => {
    const typeString = type === "tv" ? "show" : "movie";
    return media.map(data => ({...data, __type: typeString}))
}

export const searchMovies = (query: string)=>search<TmdbMovie>("movie", query)
export const searchShows = (query: string)=>search<TmdbShow>("tv", query)
const search = async <MediaType extends Media>(mediaType: MediaCategory, query: string): Promise<SearchResponse<MediaType>> => {
    try {
        const response = await axios.get<SearchResponse<MediaType>>(`${tmdbBaseUrl}/search/${mediaType}?api_key=${secrets.MOVIE_DB_API_KEY}&query=${query}`)


        return {...response.data, results: markMediaTypes(response.data.results, mediaType)}
    } catch (e) {
        throw Error(`Failed to search for ${query} in ${mediaType}: ${e}`)
    }
}