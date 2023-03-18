import type { ValidatedEventAPIGatewayProxyEvent } from "../../../libs/api-gateway";
import { formatJSONResponse } from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";

import type schema from "./schema";

const postRequest: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const {
    body: { name },
  } = event;

  return formatJSONResponse({
    message: `Hello ${name}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(postRequest);
