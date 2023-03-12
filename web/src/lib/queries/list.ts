import {endpoints} from "../config";

export const updateList = async (mediaIds: string[], authToken: string): Promise<undefined> => {
    const response = await fetch(
        `${endpoints.lambdaBase}/updateList`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ids: mediaIds.map(id => `${id}`),
            })
        }
    )

    if (response.ok) {
        return await response.json()
    }

    throw Error(await response.text())
}

export const getList = async (authToken: string): Promise<{data: {mediaIds: string[]}}> => {
    const response = await fetch(
        `${endpoints.lambdaBase}/getList`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
        }
    )

    if (response.ok) {
        return await response.json()
    }

    throw Error(await response.text())
}

export const getMovie = async (authToken: string, id: string): Promise<Movie> => {
    const response = await fetch(
        `${endpoints.lambdaBase}/getMovie?id=${id}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
        }
    )

    if (response.ok) {
        return await response.json()
    }

    throw Error(await response.text())
}

type Media = {id: string, title: string}
export type Movie = {movie: Media}
export type Show = {show: Media};
export const getShow = async (authToken: string, id: string): Promise<Show> => {
    const response = await fetch(
        `${endpoints.lambdaBase}/getShow?id=${id}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
        }
    )

    if (response.ok) {
        return await response.json()
    }

    throw Error(await response.text())
}
