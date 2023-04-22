import { endpoints } from "../utils/config";

export interface WatchProviderRegion {
  countryId: string;
  name: string;
}

export const getWatchProviderRegions = async (
  authToken: string
): Promise<{
  data: WatchProviderRegion[];
}> => {
  const response = await fetch(
    `${endpoints.lambdaBase}/getWatchProviderRegions`,
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
