import type { ValidatedEventAPIGatewayProxyEvent } from "../../../libs/api-gateway";
import { formatJSONResponse } from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import { updateList, type List } from "../../../domain/list";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const {
    requestContext: {
      authorizer: {
        jwt: {
          claims: { sub },
        },
      },
    },
    body: { media },
  } = event;
  const [_, userId] = sub.split("|");
  const data: List = { userId, media };

  const result = await updateList(data, userId);

  return formatJSONResponse({
    data: result,
  });
};

export const main = middyfy(handler);
