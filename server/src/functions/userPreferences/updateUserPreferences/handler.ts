import type { ValidatedEventAPIGatewayProxyEvent } from "../../../libs/api-gateway";
import { formatJSONResponse } from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";

import type schema from "./schema";
import withSentry from "serverless-sentry-lib";
import { updateUserPreferences } from "../../../domain/userPreferences";

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

    const updatedPreferences = await updateUserPreferences(
      userId,
      preferencesToUpdate
    );

    return formatJSONResponse({
      data: updatedPreferences,
    });
  });

export const main = middyfy(postRequest);
