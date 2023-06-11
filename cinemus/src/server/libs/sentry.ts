import * as Sentry from "@sentry/serverless";
import { sentry } from "../config";

Sentry.AWSLambda.init({
  dsn: sentry.DSN,
  release: "git",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

export const withSentry = Sentry.AWSLambda.wrapHandler;

export default Sentry;
