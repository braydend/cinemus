// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://60f14eaec17a45d19db8fffc9e8bf8ef@o538041.ingest.sentry.io/4505343869714432",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1, // Profiling sample rate is relative to tracesSampleRate
  integrations: [
    // Add profiling integration to list of integrations
    new ProfilingIntegration(),
  ],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
