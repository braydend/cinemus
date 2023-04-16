// eslint-disable-next-line
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_AUTH_AUDIENCE: string;
  readonly VITE_API_HOST: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_REPLAY_TRACE_SAMPLE_RATE?: number;
  readonly VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE?: number;
  readonly VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE?: number;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_SENTRY_RELEASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
