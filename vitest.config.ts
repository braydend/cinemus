import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["src/**/**/*.test.ts", "src/**/**/*.test.tsx"],
    setupFiles: ["test/setup.ts"],
    environment: "jsdom",
    globals: true,
  },
  plugins: [tsconfigPaths()],
});
