import { afterAll, beforeAll, afterEach, vi } from "vitest";
import { server } from "./mocks/server";
import { dropAllCollections } from "./utils/db";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import * as config from "~/server/config";

const mongo = await MongoMemoryServer.create();

vi.spyOn(config, "db", "get").mockReturnValue({
  DATABASE_NAME: "test",
  MONGO_CONNECTION_STRING: mongo.getUri(),
});

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(async () => {
  await dropAllCollections();
  await mongo.stop();
  server.close();
});
