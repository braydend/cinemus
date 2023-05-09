import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import { getShow } from "../../../domain/show";
import Sentry, { withSentry } from "../../../libs/sentry";

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      queryStringParameters,
      requestContext: {
        authorizer: {
          jwt: {
            claims: { sub },
          },
        },
      },
    } = event;
    const [_, userId] = sub.split("|");
    Sentry.setUser({ id: userId });
    const { id } = queryStringParameters;
    const region = queryStringParameters
      ? queryStringParameters.region
      : undefined;

    const show = await getShow(id, region);

    return formatJSONResponse({
      media: show,
    });
  });

export const main = middyfy(handler);
