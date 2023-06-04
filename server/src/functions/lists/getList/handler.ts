import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { getList } from "../../../domain/list";
import type schema from "./schema";
import Sentry, { withSentry } from "../../../libs/sentry";
import { createCacheInstance } from "../../../db/upstash/cache";

createCacheInstance();

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      requestContext: {
        authorizer: {
          jwt: {
            claims: { sub },
          },
        },
      },
      queryStringParameters,
    } = event;
    const [_, userId] = sub.split("|");
    Sentry.setUser({ id: userId });
    const region = queryStringParameters
      ? queryStringParameters.region
      : undefined;

    const data = await getList(userId, region);

    return formatJSONResponse({
      data,
    });
  });

export const main = middyfy(handler);
