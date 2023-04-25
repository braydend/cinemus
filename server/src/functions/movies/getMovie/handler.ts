import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import { getMovie } from "../../../domain/movie";
import withSentry from "serverless-sentry-lib";

const getMovieHandler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const { queryStringParameters } = event;
    const { id } = queryStringParameters;
    const region = queryStringParameters
      ? queryStringParameters.region
      : undefined;

    const movie = await getMovie(id, region);

    return formatJSONResponse({
      movie,
    });
  });

export const main = middyfy(getMovieHandler);
