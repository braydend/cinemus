import { endpoints } from "../utils/config";

export interface UserPreferences {
  watchProviderRegion?: string;
}

export const getUserPreferences = async (): Promise<{
  data: UserPreferences;
}> => {
  const response = await fetch(`${endpoints.lambdaBase}/userPreferences`, {
    method: "GET",
  });

  if (response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  }

  throw Error(await response.text());
};

export const updateUserPreferences = async (
  updatedPreferences: UserPreferences
): Promise<{
  data: UserPreferences;
}> => {
  const response = await fetch(`${endpoints.lambdaBase}/userPreferences`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPreferences),
  });

  if (response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  }

  throw Error(await response.text());
};
