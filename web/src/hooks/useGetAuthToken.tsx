import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { auth } from "../utils/config";

interface GetAuthTokenResponse {
  authToken: string;
  isLoading: boolean;
}

export const useGetAuthToken = (): GetAuthTokenResponse => {
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState("");
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      // This is logging out the user for some reason
      (async () => {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: auth.audience,
          },
        });

        if (import.meta.env.DEV) {
          console.log(token);
        }
        setAuthToken(token);
        setIsLoading(false);
      })();
    }
  }, [isAuthenticated]);

  return {
    authToken,
    isLoading,
  };
};
