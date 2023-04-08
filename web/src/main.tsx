import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import { auth, sentry } from "./utils/config";

const queryClient = new QueryClient();
Sentry.init({
  dsn: sentry.dsn,
  environment: sentry.environment,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: sentry.tracesSampleRate,
  replaysSessionSampleRate: sentry.sessionSampleRate,
  replaysOnErrorSampleRate: sentry.errorSampleRate,
});

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
        <App />
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
