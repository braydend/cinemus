import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import { searchMovies } from "../../../domain/movie";

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const {
    queryStringParameters: { query },
  } = event;

  const results = await searchMovies(query);

  return formatJSONResponse({
    results,
  });
};

export const main = middyfy(handler);
