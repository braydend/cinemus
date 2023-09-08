import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/drizzle/schema.ts",
  out: "./src/server/db/drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: "",
  },
} satisfies Config;
