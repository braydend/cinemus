import { type FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton: FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleClick = (): void => {
    (async () => {
      await loginWithRedirect();
    })();
  };

  return <button onClick={handleClick}>Log In</button>;
};
