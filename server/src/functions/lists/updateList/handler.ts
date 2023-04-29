import type { ValidatedEventAPIGatewayProxyEvent } from "../../../libs/api-gateway";
import { formatJSONResponse } from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { type bodySchema, type queryParamsSchema } from "./schema";
import { updateList, type List } from "../../../domain/list";
import Sentry, { withSentry } from "../../../libs/sentry";

const handler: ValidatedEventAPIGatewayProxyEvent<
  typeof bodySchema,
  typeof queryParamsSchema
> = withSentry(async (event) => {
  const {
    requestContext: {
      authorizer: {
        jwt: {
          claims: { sub },
        },
      },
    },
    body: { media },
    queryStringParameters,
  } = event;

  const [_, userId] = sub.split("|");
  Sentry.setUser({ id: userId });
  const data: List = { userId, media };
  const region = queryStringParameters
    ? queryStringParameters.region
    : undefined;

  const result = await updateList(data, userId, region);

  return formatJSONResponse({
    data: result,
  });
});

export const main = middyfy(handler);
