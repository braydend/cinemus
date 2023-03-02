import {Auth0Client, createAuth0Client, User} from "@auth0/auth0-spa-js";
import { writable } from "svelte/store";
import {auth} from "./config";

// Auth0 client instance
let auth0Client: Auth0Client | null = null;

// User info store
export const userInfo = writable<User>();
export const authToken = writable<string>();

// Initialize the Auth0 client
export const configureClient = async () => {
    auth0Client = await createAuth0Client({
        domain: auth.domain,
        clientId: auth.clientId,
        authorizationParams: {
            audience: auth.audience,
        }
    });
};

// Login function
export async function login() {
    await auth0Client?.loginWithRedirect({authorizationParams: { redirect_uri: "http://localhost:5173/profile" }});
}

// Logout function
export function logout() {
    auth0Client?.logout({ logoutParams: { returnTo: "http://localhost:5173/profile" } });
}

// Handle the callback from the Auth0 login
export async function handleCallback() {
    await auth0Client?.handleRedirectCallback();
    const token = await auth0Client?.getTokenSilently()
    const user = await auth0Client?.getUser();
    if (!user) {
        throw Error("Unable to get user")
    }

    if (!token) throw Error("Unable to get access token")

    userInfo.set(user);
    authToken.set(token)
}
