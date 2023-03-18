import { afterAll, beforeAll, afterEach } from "vitest";
import { server } from "./mocks/server";
import { dropAllCollections } from "./utils/db";

beforeAll(() => {
  server.listen();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.

afterEach(() => {
  server.resetHandlers();
});

afterAll(async () => {
  await dropAllCollections();
  server.close();
});
