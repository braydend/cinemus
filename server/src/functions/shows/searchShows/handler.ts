import {formatJSONResponse, ValidatedGetEventAPIGatewayProxyEvent} from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import schema from "./schema";
import {searchShows} from "../../../api/tmdb";
import {mapApiResponseToMedia} from "../../../domain/media";

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { queryStringParameters: {query}} = event

  const results = await searchShows(query)

  return formatJSONResponse({
    results: results.results.map(mapApiResponseToMedia),
  });
};

export const main = middyfy(handler);
