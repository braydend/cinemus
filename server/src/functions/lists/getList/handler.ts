import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { getList } from "../../../domain/list";
import withSentry from "serverless-sentry-lib";
import type schema from "./schema";

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
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
    const region = queryStringParameters
      ? queryStringParameters.region
      : undefined;
    const [_, userId] = sub.split("|");

    const data = await getList(userId, region);

    return formatJSONResponse({
      data,
    });
  });

export const main = middyfy(handler);
