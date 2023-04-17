import {
  type AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import withSentry from "serverless-sentry-lib";
import { getWatchProviderRegions } from "../../../domain/watchProviders";

const getRequest: AuthorisedAPIGatewayProxyEvent = withSentry(async () => {
  const data = await getWatchProviderRegions();

  return formatJSONResponse({
    data,
  });
});

export const main = middyfy(getRequest);
