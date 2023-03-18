import { vi, afterAll, beforeAll, afterEach } from "vitest";
import { getDatabase } from "../src/db/mongodb/instance";
import { server } from "./mocks/server";

// vi.mock("../src/config", () => {
//   return {
//     db: {
//       DATABASE_NAME: "test",
//     },
//     secrets: {
//       MONGO_DB_USERNAME: "cinemus-test",
//       MONGO_DB_PASSWORD: "qqMui6sIcfm876Zj",
//     },
//     url: {
//       TMDB_URL: "http://www.mocktmdb.com",
//     },
//   };
// });
// Establish API mocking before all tests.

beforeAll(() => {
  //   vi.stubEnv("DATABASE_NAME", "test");
  //   vi.stubEnv("MONGO_DB_USERNAME", "cinemus-test");
  //   vi.stubEnv("MONGO_DB_PASSWORD", "qqMui6sIcfm876Zj");
  //   vi.stubEnv("TMDB_URL", "http://www.mocktmdb.com");
  server.listen();
});

// Reset any request handlers that we may add during the tests,

// so they don't affect other tests.

afterEach(async () => {
  // Drop all db collections to prevent cross pollination between tests
  const db = getDatabase();
  const collections = await db.collections();
  for (const collection of collections) {
    await db.dropCollection(collection.collectionName);
  }

  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
