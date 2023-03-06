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
