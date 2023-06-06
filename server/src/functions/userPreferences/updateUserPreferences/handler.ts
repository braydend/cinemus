import type { ValidatedEventAPIGatewayProxyEvent } from "../../../libs/api-gateway";
import { formatJSONResponse } from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";

import type schema from "./schema";
import { updateUserPreferences } from "../../../domain/userPreferences";
import Sentry, { withSentry } from "../../../libs/sentry";
import { createCacheInstance } from "../../../db/upstash/cache";

createCacheInstance();

const postRequest: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      body: preferencesToUpdate,
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

    const updatedPreferences = await updateUserPreferences(
      userId,
      preferencesToUpdate
    );

    return formatJSONResponse({
      data: updatedPreferences,
    });
  });

export const main = middyfy(postRequest);
