import {
  type AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import withSentry from "serverless-sentry-lib";
import { getUserPreferences as getUserPreferencesQuery } from "../../../domain/userPreferences";

const getRequest: AuthorisedAPIGatewayProxyEvent = withSentry(async (event) => {
  const {
    requestContext: {
      authorizer: {
        jwt: {
          claims: { sub },
        },
      },
    },
  } = event;
  const [_, userId] = sub.split("|");
  const userPreferences = await getUserPreferencesQuery(userId);
  return formatJSONResponse({
    data: userPreferences,
  });
});

export const main = middyfy(getRequest);
