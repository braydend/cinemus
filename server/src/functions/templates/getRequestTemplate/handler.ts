import {formatJSONResponse, ValidatedGetEventAPIGatewayProxyEvent} from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import schema from "./schema";

const getRequest: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { queryStringParameters: {query}} = event

  return formatJSONResponse({
    query,
    event,
  });
};

export const main = middyfy(getRequest);
