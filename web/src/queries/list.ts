import { endpoints } from "../utils/config";

export const updateList = async (
  media: Array<{ id: string; __type: "movie" | "show" }>,
  authToken: string
): Promise<{
  data: Array<{ id: string; __type: "movie" | "show"; title: string }>;
}> => {
  const response = await fetch(`${endpoints.lambdaBase}/updateList`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media,
    }),
  });

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};

export const getList = async (
  authToken: string
): Promise<{
  data: Array<{ id: string; __type: "movie" | "show"; title: string }>;
}> => {
  const response = await fetch(`${endpoints.lambdaBase}/getList`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};

export const getMovie = async (
  authToken: string,
  id: string
): Promise<Movie> => {
  const response = await fetch(`${endpoints.lambdaBase}/getMovie?id=${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};

interface Media {
  id: string;
  title: string;
}
export interface Movie {
  movie: Media;
}
export interface Show {
  show: Media;
}
export const getShow = async (authToken: string, id: string): Promise<Show> => {
  const response = await fetch(`${endpoints.lambdaBase}/getShow?id=${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};
