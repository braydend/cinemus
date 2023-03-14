import {FC} from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton: FC = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()}>Log In</button>;
};
