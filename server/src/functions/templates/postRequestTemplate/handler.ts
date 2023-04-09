import type { ValidatedEventAPIGatewayProxyEvent } from "../../../libs/api-gateway";
import { formatJSONResponse } from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";

import type schema from "./schema";
import withSentry from "serverless-sentry-lib";

const postRequest: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      body: { name },
    } = event;

    return formatJSONResponse({
      message: `Hello ${name}, welcome to the exciting Serverless world!`,
      event,
    });
  });

export const main = middyfy(postRequest);
