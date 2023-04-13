import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      sourcemap: true,
    },
    test: {
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
      setupFiles: ["tests/setup.ts"],
      environment: "jsdom",
      globals: true,
    },
    plugins: [
      react(),
      sentryVitePlugin({
        org: "braydend",
        project: "cinemus-web",
        include: "./dist",
        authToken: env.SENTRY_AUTH_TOKEN,
      }),
    ],
  };
});
