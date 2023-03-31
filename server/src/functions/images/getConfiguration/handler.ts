import {
  type AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { getConfiguration } from "../../../domain/configuration";

const handler: AuthorisedAPIGatewayProxyEvent = async () => {
  const configuration = await getConfiguration();

  return formatJSONResponse({
    configuration,
  });
};

export const main = middyfy(handler);
