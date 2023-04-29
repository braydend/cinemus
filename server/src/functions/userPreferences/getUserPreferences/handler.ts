import {
  type AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { getUserPreferences as getUserPreferencesQuery } from "../../../domain/userPreferences";
import Sentry, { withSentry } from "../../../libs/sentry";

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
  Sentry.setUser({ id: userId });

  const userPreferences = await getUserPreferencesQuery(userId);
  return formatJSONResponse({
    data: userPreferences,
  });
});

export const main = middyfy(getRequest);
