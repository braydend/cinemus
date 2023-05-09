import { endpoints } from "../utils/config";
import { type Media } from "../types";

export const getShow = async (
  authToken: string,
  id: string,
  region?: string
): Promise<{ media: Media }> => {
  const regionQueryString = region != null ? `&region=${region}` : "";

  const response = await fetch(
    `${endpoints.lambdaBase}/getShow?id=${id}${regionQueryString}`,
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

export const getMovie = async (
  authToken: string,
  id: string,
  region?: string
): Promise<{ media: Media }> => {
  const regionQueryString = region != null ? `&region=${region}` : "";
  const response = await fetch(
    `${endpoints.lambdaBase}/getMovie?id=${id}${regionQueryString}`,
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

// export interface Movie {
//   movie: Media;
// }
// export interface Show {
//   show: Media;
// }
// export const getShow = async (authToken: string, id: string): Promise<Show> => {
//   const response = await fetch(`${endpoints.lambdaBase}/getShow?id=${id}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${authToken}`,
//     },
//   });
//
//   if (response.ok) {
//     return await response.json();
//   }
//
//   throw Error(await response.text());
// };
