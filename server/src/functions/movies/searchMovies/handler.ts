import {formatJSONResponse, ValidatedGetEventAPIGatewayProxyEvent} from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import schema from "./schema";
import {searchMovies} from "../../../api/tmdb";
import {mapApiResponseToMedia} from "../../../domain/movie";

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { queryStringParameters: {query}} = event

  const results = await searchMovies(query)

  return formatJSONResponse({
    results: results.results.map(mapApiResponseToMedia),
  });
};

export const main = middyfy(handler);
