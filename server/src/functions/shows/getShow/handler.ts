import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import { getShow } from "../../../domain/show";
import withSentry from "serverless-sentry-lib";

const handler: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const { queryStringParameters } = event;
    const { id } = queryStringParameters;
    const region = queryStringParameters
      ? queryStringParameters.region
      : undefined;

    const show = await getShow(id, region);

    return formatJSONResponse({
      show,
    });
  });

export const main = middyfy(handler);
