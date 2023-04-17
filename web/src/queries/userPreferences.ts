import { endpoints } from "../utils/config";

export interface UserPreferences {
  watchProviderRegion?: string;
}

export const getUserPreferences = async (
  authToken: string
): Promise<{
  data: UserPreferences;
}> => {
  const response = await fetch(`${endpoints.lambdaBase}/userPreferences`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};

export const updateUserPreferences = async (
  updatedPreferences: UserPreferences,
  authToken: string
): Promise<{
  data: UserPreferences;
}> => {
  const response = await fetch(`${endpoints.lambdaBase}/userPreferences`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPreferences),
  });

  if (response.ok) {
    return await response.json();
  }

  throw Error(await response.text());
};
