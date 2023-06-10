import { env } from "~/env.mjs";

export const auth = {
  clientId: env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: env.NEXT_PUBLIC_AUTH0_DOMAIN,
  audience: env.NEXT_PUBLIC_AUTH0_AUDIENCE,
};

// export const endpoints = {
//   lambdaBase: env.NEXT_PUBLIC_API_HOST,
// };

export const environment = {
  isDev: env.NEXT_PUBLIC_NODE_ENV === "development",
  name: env,
};

export const sentry = {
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: env.NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE ?? 0.3,
  sessionSampleRate: env.NEXT_PUBLIC_SENTRY_SESSION_SAMPLE_RATE ?? 0.1,
  errorSampleRate: env.NEXT_PUBLIC_SENTRY_ERROR_SAMPLE_RATE ?? 1.0,
  environment: env.NEXT_PUBLIC_SENTRY_ENV ?? env.NEXT_PUBLIC_NODE_ENV ?? "prod",
  release: env.NEXT_PUBLIC_SENTRY_RELEASE,
};
