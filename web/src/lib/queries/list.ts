import {endpoints} from "../config";

export const updateList = async (mediaIds: string[], authToken: string): Promise<undefined> => {
    const response = await fetch(
        `${endpoints.lambdaBase}/updateList`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                ids: mediaIds,
            })
        }
    )

    if (response.ok) {
        return await response.json()
    }

    throw Error(await response.text())
}

export const getList = async (authToken: string): Promise<{ids: string[]}> => {
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
