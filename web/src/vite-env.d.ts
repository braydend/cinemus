// eslint-disable-next-line
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_AUTH_AUDIENCE: string;
  readonly VITE_API_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
