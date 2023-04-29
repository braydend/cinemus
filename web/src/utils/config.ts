export const auth = {
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH_DOMAIN,
  audience: import.meta.env.VITE_AUTH_AUDIENCE,
};

export const endpoints = {
  lambdaBase: import.meta.env.VITE_API_HOST,
};

const env = import.meta.env.DEV
  ? "dev"
  : import.meta.env.PROD
  ? "prod"
  : undefined;

export const environment = {
  isDev: env === "dev",
  name: env,
};

export const sentry = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: import.meta.env.VITE_SENTRY_REPLAY_TRACE_SAMPLE_RATE ?? 0.3,
  sessionSampleRate:
    import.meta.env.VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE ?? 0.1,
  errorSampleRate: import.meta.env.VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE ?? 1.0,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? env ?? "prod",
  release: import.meta.env.VITE_SENTRY_RELEASE,
};
