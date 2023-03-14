import {FC} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {LogoutButton} from "../LogoutButton/LogoutButton";
import {LoginButton} from "../LoginButton/LoginButton";

export const Profile: FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();


    if (!isAuthenticated) {
        return <LoginButton />
    }

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
            <div>
                <img src={user?.picture} alt={user?.name} />
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                <LogoutButton />
            </div>
    )
};