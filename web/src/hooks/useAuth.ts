import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { auth, environment } from "../utils/config";
import * as Sentry from "@sentry/react";

interface User {
  name?: string;
  picture?: string;
  email?: string;
}

interface Auth {
  isLoading: boolean;
  jwt: string;
  user?: User;
  isAuthenticated: boolean;
  loginWithRedirect: () => Promise<void>;
  logout: () => void;
}

export const useAuth = (): Auth => {
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState("");
  const {
    getAccessTokenSilently,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      // This is logging out the user for some reason
      (async () => {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: auth.audience,
          },
        });
        setAuthToken(token);
        setIsLoading(false);
      })();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (environment.isDev) {
      console.log("user", user);
      console.log("jwt", authToken);
    }
  }, [authToken, user]);

  return {
    isLoading,
    jwt: authToken,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  };
};
