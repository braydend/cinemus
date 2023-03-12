import {formatJSONResponse, ValidatedGetEventAPIGatewayProxyEvent} from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import schema from "./schema";
import {getShow} from "../../../domain/show";

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { queryStringParameters: {id}} = event

  const show = await getShow(id)

  return formatJSONResponse({
    show,
  });
};

export const main = middyfy(handler);
