import {TmdbMovie, TmdbShow} from "../api/tmdb";

type Media = {
    id: number,
    title: string,
};

export const mapApiResponseToMedia = (response: TmdbMovie| TmdbShow): Media => {
    const isMovie = response.__type === "movie"

    return {
        id: response.id,
        title: isMovie ? response.title : response.name
    }
};