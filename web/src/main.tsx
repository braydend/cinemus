import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { auth, sentry } from "./utils/config";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { routes } from "./router";
import { queryClient } from "./queries/queryClient";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import { DefaultErrorBoundary } from "./components/errorBoundary";

Sentry.init({
  dsn: sentry.dsn,
  environment: sentry.environment,
  release: sentry.release,
  tracesSampleRate: sentry.tracesSampleRate,
  replaysSessionSampleRate: sentry.sessionSampleRate,
  replaysOnErrorSampleRate: sentry.errorSampleRate,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
});

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);

const router = sentryCreateBrowserRouter(routes);

enum color {
  darkPurple = "#4b2366",
  purple = "#79609f",
  lightPurple = "#ac80b9",
  palePurple = "#cab1d5",
  yellowPink = "#e2bcae",
  yellow = "#f8d089",
  gray = "#edf0f2",
}

const theme = createTheme({
  palette: {
    primary: {
      main: color.purple,
    },
    secondary: {
      main: color.lightPurple,
    },
    background: {
      default: color.gray,
    },
  },
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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DefaultErrorBoundary>
            <SnackbarProvider maxSnack={3}>
              <RouterProvider router={router} />
            </SnackbarProvider>
          </DefaultErrorBoundary>
          <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
