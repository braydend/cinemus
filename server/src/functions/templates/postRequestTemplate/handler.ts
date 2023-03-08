import type { ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';

import schema from './schema';

const postRequest: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { body: { name } } = event

  return formatJSONResponse({
    // @ts-ignore
    message: `Hello ${name}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(postRequest);
