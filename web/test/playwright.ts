import { test as base, expect } from "@playwright/test";
import { rest } from "msw";
import type { MockServiceWorker, Config } from "playwright-msw";
import { createWorkerFixture } from "playwright-msw";
import { handlers } from "./mocks/handlers";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const testFactory = (config?: Config) =>
  base.extend<{
    worker: MockServiceWorker;
    rest: typeof rest;
  }>({
    worker: createWorkerFixture(handlers, config),
    rest,
  });

const test = testFactory();

export { testFactory, test, expect };
