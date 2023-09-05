import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/drizzle/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: "",
  },
} satisfies Config;
