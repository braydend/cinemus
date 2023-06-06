import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import { searchShows } from "../../../domain/show";
import Sentry, { withSentry } from "../../../libs/sentry";
import { createCacheInstance } from "../../../db/upstash/cache";

createCacheInstance();

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      queryStringParameters: { query },
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

    const results = await searchShows(query);

    return formatJSONResponse({
      results,
    });
  });

export const main = middyfy(handler);
