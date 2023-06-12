import { endpoints } from "../utils/config";

export interface WatchProviderRegion {
  countryId: string;
  name: string;
}

export const getWatchProviderRegions = async (): Promise<{
  data: WatchProviderRegion[];
}> => {
  const response = await fetch(
    `${endpoints.lambdaBase}/getWatchProviderRegions`,
    {
      method: "GET",
    }
  );

  if (response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  }

  throw Error(await response.text());
};
