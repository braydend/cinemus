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
    const {
      queryStringParameters: { id },
    } = event;

    const movie = await getMovie(id);

    return formatJSONResponse({
      movie,
    });
  });

export const main = middyfy(getMovieHandler);
