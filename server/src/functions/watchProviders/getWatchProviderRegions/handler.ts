import {
  type AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { getWatchProviderRegions } from "../../../domain/watchProviders";
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
  const data = await getWatchProviderRegions();

  return formatJSONResponse({
    data,
  });
});

export const main = middyfy(getRequest);
