import { endpoints } from "../utils/config";
import { type Media } from "../types";

export const updateList = async (
  media: Array<Pick<Media, "id" | "__type" | "isWatched">>,
  authToken: string,
  region?: string
): Promise<{
  data: Media[];
}> => {
  const regionQueryString = region != null ? `?region=${region}` : "";

  const response = await fetch(
    `${endpoints.lambdaBase}/updateList${regionQueryString}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media,
      }),
    }
  );

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};

export const getList = async (
  authToken: string,
  region?: string
): Promise<{
  data: Media[];
}> => {
  const regionQueryString = region != null ? `?region=${region}` : "";

  const response = await fetch(
    `${endpoints.lambdaBase}/getList${regionQueryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};
