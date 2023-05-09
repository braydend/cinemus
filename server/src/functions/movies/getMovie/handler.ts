import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import { getMovie } from "../../../domain/movie";
import Sentry, { withSentry } from "../../../libs/sentry";

const getMovieHandler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      requestContext: {
        authorizer: {
          jwt: {
            claims: { sub },
          },
        },
      },
      queryStringParameters,
    } = event;
    const { id } = queryStringParameters;
    const [_, userId] = sub.split("|");
    Sentry.setUser({ id: userId });
    const region = queryStringParameters
      ? queryStringParameters.region
      : undefined;

    const movie = await getMovie(id, region);

    return formatJSONResponse({
      media: movie,
    });
  });

export const main = middyfy(getMovieHandler);
