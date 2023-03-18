import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["test/setupTests.ts"],
    env: {
      TMDB_URL: "http://www.mocktmdb.com",
    },
    include: ["src/**/*.test.ts"],
  },
});
