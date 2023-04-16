import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { auth, sentry } from "./utils/config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router";

const queryClient = new QueryClient();
Sentry.init({
  dsn: sentry.dsn,
  environment: sentry.environment,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  release: sentry.release,
  tracesSampleRate: sentry.tracesSampleRate,
  replaysSessionSampleRate: sentry.sessionSampleRate,
  replaysOnErrorSampleRate: sentry.errorSampleRate,
});

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth.domain}
      clientId={auth.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth.audience,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
