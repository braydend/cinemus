import {
  formatJSONResponse,
  type ValidatedGetEventAPIGatewayProxyEvent,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import type schema from "./schema";
import withSentry from "serverless-sentry-lib";

const getRequest: ValidatedGetEventAPIGatewayProxyEvent<typeof schema> =
  withSentry(async (event) => {
    const {
      queryStringParameters: { query },
    } = event;

    return formatJSONResponse({
      query,
      event,
    });
  });

export const main = middyfy(getRequest);
