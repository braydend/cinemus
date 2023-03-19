import {
  type AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { getList } from "../../../domain/list";

const handler: AuthorisedAPIGatewayProxyEvent = async (event) => {
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

  const data = await getList(userId);

  return formatJSONResponse({
    data,
  });
};

export const main = middyfy(handler);
