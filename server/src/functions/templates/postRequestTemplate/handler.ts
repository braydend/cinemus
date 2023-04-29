import type { ValidatedEventAPIGatewayProxyEvent } from "../../../libs/api-gateway";
import { formatJSONResponse } from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";

import type schema from "./schema";
import Sentry, { withSentry } from "../../../libs/sentry";

const postRequest: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      body: { name },
      requestContext: {
        authorizer: {
          jwt: {
            claims: { sub },
          },
        },
      },
    } = event;
    const [_, userId] = sub.split("|");
    Sentry.setUser({ id: userId });

    return formatJSONResponse({
      message: `Hello ${name}, welcome to the exciting Serverless world!`,
      event,
    });
  });

export const main = middyfy(postRequest);
